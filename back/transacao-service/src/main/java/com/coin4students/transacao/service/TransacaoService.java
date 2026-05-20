package com.coin4students.transacao.service;

import com.coin4students.transacao.dto.EnvioMoedasEvent;
import com.coin4students.transacao.model.Transacao;
import com.coin4students.transacao.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final EmailService emailService;

    @Value("${aluno.service.url}")
    private String alunoServiceUrl;

    public TransacaoService(TransacaoRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public Transacao registrarEnvioMoedas(EnvioMoedasEvent evento) {
        Transacao transacao = new Transacao();

        transacao.setIdProfessor(evento.getIdProfessor());
        transacao.setIdAluno(evento.getIdAluno());
        transacao.setNomeProfessor(evento.getNomeProfessor());
        transacao.setNomeAluno(evento.getNomeAluno());
        transacao.setValor(evento.getValor());
        transacao.setMensagem(evento.getMensagem());
        transacao.setTipo("ENVIO_MOEDAS");
        transacao.setData(LocalDateTime.now());

        Transacao transacaoSalva = repository.save(transacao);

        String url = alunoServiceUrl + "/alunos/"
                + evento.getIdAluno()
                + "/adicionar-moedas?valor="
                + evento.getValor();

        restTemplate.put(url, null);

        tentarEnviarEmailProfessor(evento);
        tentarEnviarEmailAluno(evento);

        return transacaoSalva;
    }

    private void tentarEnviarEmailProfessor(EnvioMoedasEvent evento) {
        try {
            emailService.enviarEmailProfessor(
                    evento.getEmailProfessor(),
                    evento.getValor(),
                    evento.getNomeAluno()
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para professor: " + mensagemErroCompleta(e));
        }
    }

    private void tentarEnviarEmailAluno(EnvioMoedasEvent evento) {
        try {
            emailService.enviarEmailAluno(
                    evento.getEmailAluno(),
                    evento.getValor(),
                    evento.getNomeProfessor(),
                    evento.getMensagem()
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para aluno: " + mensagemErroCompleta(e));
        }
    }

    private String mensagemErroCompleta(Exception e) {
        StringBuilder mensagem = new StringBuilder(e.getClass().getSimpleName() + ": " + e.getMessage());
        Throwable causa = e.getCause();

        while (causa != null) {
            mensagem.append(" | Causa: ")
                    .append(causa.getClass().getSimpleName())
                    .append(": ")
                    .append(causa.getMessage());
            causa = causa.getCause();
        }

        return mensagem.toString();
    }

    public List<Transacao> extratoAluno(Long idAluno) {
        return repository.findByIdAluno(idAluno);
    }

    public List<Transacao> extratoProfessor(Long idProfessor) {
        return repository.findByIdProfessor(idProfessor);
    }
}
