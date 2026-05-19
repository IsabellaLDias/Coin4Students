package com.coin4students.professor.service;

import com.coin4students.professor.config.RabbitMQConfig;
import com.coin4students.professor.dto.EnvioMoedasDTO;
import com.coin4students.professor.dto.EnvioMoedasEvent;
import com.coin4students.professor.model.Professor;
import com.coin4students.professor.repository.ProfessorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${aluno.service.url}")
    private String alunoServiceUrl;

    @Value("${transacao.service.url:}")
    private String transacaoServiceUrl;

    public ProfessorService(
        ProfessorRepository professorRepository,
        RabbitTemplate rabbitTemplate,
        ObjectMapper objectMapper,
        EmailService emailService
    ) {
        this.professorRepository = professorRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
        this.emailService = emailService;
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

    public Professor enviarMoedas(Long idProfessor, EnvioMoedasDTO dto) {
        Professor professor = buscarPorId(idProfessor);

        if (dto.getIdAluno() == null) {
            throw new RuntimeException("Aluno e obrigatorio");
        }

        if (dto.getValor() == null || dto.getValor() <= 0) {
            throw new RuntimeException("O valor deve ser maior que zero");
        }

        if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
            throw new RuntimeException("A mensagem e obrigatoria");
        }

        if (professor.getSaldoMoedas() < dto.getValor()) {
            throw new RuntimeException("Saldo insuficiente");
        }

        AlunoResponse aluno = restTemplate.getForObject(
                alunoServiceUrl + "/alunos/" + dto.getIdAluno(),
                AlunoResponse.class
        );

        if (aluno == null) {
            throw new RuntimeException("Aluno nao encontrado");
        }

        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.getValor());
        professorRepository.save(professor);

        adicionarMoedasAoAluno(dto);
        tentarEnviarEmails(professor, aluno, dto);

        EnvioMoedasEvent evento = new EnvioMoedasEvent(
                idProfessor,
                dto.getIdAluno(),
                dto.getValor(),
                dto.getMensagem()
        );

        evento.setEmailProfessor(dto.getEmailProfessor());
        evento.setEmailAluno(dto.getEmailAluno() != null && !dto.getEmailAluno().isBlank()
                ? dto.getEmailAluno()
                : aluno.getEmail());
        evento.setNomeProfessor(professor.getNome());
        evento.setNomeAluno(aluno.getNome());

        publicarEventoEnvioMoedas(evento);

        return professor;
    }

    public List<?> historico(Long idProfessor) {
        if (transacaoServiceUrl == null || transacaoServiceUrl.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return restTemplate.getForObject(
                    transacaoServiceUrl + "/transacoes/extrato/professor/" + idProfessor,
                    List.class
            );
        } catch (Exception e) {
            System.err.println("Erro ao buscar historico do professor: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private void adicionarMoedasAoAluno(EnvioMoedasDTO dto) {
        String url = alunoServiceUrl + "/alunos/"
                + dto.getIdAluno()
                + "/adicionar-moedas?valor="
                + dto.getValor();

        restTemplate.put(url, null);
    }

    private void tentarEnviarEmails(Professor professor, AlunoResponse aluno, EnvioMoedasDTO dto) {
        try {
            emailService.enviarEmailProfessor(
                    professor.getEmail(),
                    dto.getValor(),
                    aluno.getNome()
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para professor: " + e.getMessage());
        }

        try {
            emailService.enviarEmailAluno(
                    dto.getEmailAluno() != null && !dto.getEmailAluno().isBlank()
                            ? dto.getEmailAluno()
                            : aluno.getEmail(),
                    dto.getValor(),
                    professor.getNome(),
                    dto.getMensagem()
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para aluno: " + e.getMessage());
        }
    }

    private void publicarEventoEnvioMoedas(EnvioMoedasEvent evento) {
        try {
            String json = objectMapper.writeValueAsString(evento);
            rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_ENVIO_MOEDAS, json);
        } catch (Exception e) {
            System.err.println("Erro ao publicar evento de envio de moedas: " + e.getMessage());
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
