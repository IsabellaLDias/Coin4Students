package com.coin4students.professor.service;

import com.coin4students.professor.config.RabbitMQConfig;
import com.coin4students.professor.dto.EnvioMoedasDTO;
import com.coin4students.professor.dto.EnvioMoedasEvent;
import com.coin4students.professor.model.Professor;
import com.coin4students.professor.repository.ProfessorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${aluno.service.url:https://aluno-service-aqwz.onrender.com}")
    private String alunoServiceUrl;

    @Value("${transacao.service.url:https://transacao-service-hc98.onrender.com}")
    private String transacaoServiceUrl;

    public ProfessorService(
        ProfessorRepository professorRepository,
        RabbitTemplate rabbitTemplate,
        ObjectMapper objectMapper
    ) {
        this.professorRepository = professorRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public Professor cadastrar(Professor professor) {
        validarCredenciais(professor);
        professor.setSaldoMoedas(50000);

        return professorRepository.save(professor);
    }

    public Professor buscarPorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor nao encontrado"));
    }

    public List<Professor> listar() {
        return professorRepository.findAll();
    }

    public Professor atualizar(Long id, Professor professorAtualizado) {
        validarCredenciais(professorAtualizado);

        Professor professor = buscarPorId(id);

        professor.setNome(professorAtualizado.getNome());
        professor.setEmail(professorAtualizado.getEmail());
        professor.setSenha(professorAtualizado.getSenha());
        professor.setCpf(professorAtualizado.getCpf());
        professor.setDepartamento(professorAtualizado.getDepartamento());
        professor.setSaldoMoedas(professorAtualizado.getSaldoMoedas());

        return professorRepository.save(professor);
    }

    public void deletar(Long id) {
        professorRepository.deleteById(id);
    }

    @Transactional
    public Professor enviarMoedas(Long idProfessor, EnvioMoedasDTO dto) {
        Professor professor = buscarPorId(idProfessor);

        if (dto.getIdAluno() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aluno e obrigatorio");
        }

        if (dto.getValor() == null || dto.getValor() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor deve ser maior que zero");
        }

        if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A mensagem e obrigatoria");
        }

        if (professor.getSaldoMoedas() < dto.getValor()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo insuficiente");
        }

        AlunoResponse aluno = buscarAluno(dto.getIdAluno());

        if (aluno == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno nao encontrado");
        }

        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.getValor());
        professorRepository.save(professor);

        EnvioMoedasEvent evento = new EnvioMoedasEvent(
                idProfessor,
                dto.getIdAluno(),
                dto.getValor(),
                dto.getMensagem()
        );

        evento.setEmailProfessor(professor.getEmail() != null && !professor.getEmail().isBlank()
                ? professor.getEmail()
                : dto.getEmailProfessor());
        evento.setEmailAluno(dto.getEmailAluno() != null && !dto.getEmailAluno().isBlank()
                ? dto.getEmailAluno()
                : aluno.getEmail());
        evento.setNomeProfessor(professor.getNome());
        evento.setNomeAluno(aluno.getNome());

        registrarEnvioMoedas(evento);

        return professor;
    }

    public List<?> historico(Long idProfessor) {
        if (transacaoServiceUrl == null || transacaoServiceUrl.isBlank()) {
            throw new RuntimeException("TRANSACAO_SERVICE_URL nao configurada no professor-service");
        }

        try {
            return restTemplate.getForObject(
                    transacaoServiceUrl + "/transacoes/extrato/professor/" + idProfessor,
                    List.class
            );
        } catch (Exception e) {
            System.err.println("Erro ao buscar historico do professor: " + e.getMessage());
            throw new RuntimeException("Erro ao buscar historico do professor", e);
        }
    }

    private void publicarEventoEnvioMoedas(EnvioMoedasEvent evento) throws Exception {
        String json = objectMapper.writeValueAsString(evento);
        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_ENVIO_MOEDAS, json);
    }

    private void registrarEnvioMoedas(EnvioMoedasEvent evento) {
        try {
            publicarEventoEnvioMoedas(evento);
        } catch (Exception e) {
            registrarEnvioMoedasPorRest(evento, e);
        }
    }

    private void registrarEnvioMoedasPorRest(EnvioMoedasEvent evento, Exception erroRabbitMq) {
        if (transacaoServiceUrl == null || transacaoServiceUrl.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Erro ao publicar evento de envio de moedas",
                    erroRabbitMq
            );
        }

        try {
            restTemplate.postForObject(
                    transacaoServiceUrl + "/transacoes/envio-moedas",
                    evento,
                    Object.class
            );
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Erro ao registrar envio de moedas no transacao-service",
                    e
            );
        }
    }

    private AlunoResponse buscarAluno(Long idAluno) {
        try {
            return restTemplate.getForObject(
                    alunoServiceUrl + "/alunos/" + idAluno,
                    AlunoResponse.class
            );
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno nao encontrado", e);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Erro ao consultar aluno-service",
                    e
            );
        }
    }

    private void validarCredenciais(Professor professor) {
        if (professor.getEmail() == null || professor.getEmail().isBlank()) {
            throw new RuntimeException("E-mail do professor e obrigatorio");
        }

        if (professor.getSenha() == null || professor.getSenha().isBlank()) {
            throw new RuntimeException("Senha do professor e obrigatoria");
        }
    }

    static class AlunoResponse {
        private Long id;
        private String nome;
        private String email;

        public Long getId() {
            return id;
        }

        public String getNome() {
            return nome;
        }

        public String getEmail() {
            return email;
        }
    }
}
