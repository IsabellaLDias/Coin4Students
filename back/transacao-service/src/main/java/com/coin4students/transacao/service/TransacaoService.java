package com.coin4students.transacao.service;

import com.coin4students.transacao.service.EmailService;
import com.coin4students.transacao.dto.EnvioMoedasEvent;
import com.coin4students.transacao.model.Transacao;
import com.coin4students.transacao.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

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
        transacao.setValor(evento.getValor());
        transacao.setMensagem(evento.getMensagem());
        transacao.setTipo("ENVIO_MOEDAS");
        transacao.setData(LocalDateTime.now());

        Transacao transacaoSalva = repository.save(transacao);

        String url =  alunoServiceUrl + "/alunos/"
                + evento.getIdAluno()
                + "/adicionar-moedas?valor="
                + evento.getValor();

        restTemplate.put(url, null);

        emailService.enviarEmailProfessor(
                evento.getEmailProfessor(),
                evento.getValor(),
                evento.getNomeAluno()
        );

        emailService.enviarEmailAluno(
                evento.getEmailAluno(),
                evento.getValor(),
                evento.getNomeProfessor(),
                evento.getMensagem()
        );

        return transacaoSalva;
    }

    public List<Transacao> extratoAluno(Long idAluno) {
        return repository.findByIdAluno(idAluno);
    }

    public List<Transacao> extratoProfessor(Long idProfessor) {
        return repository.findByIdProfessor(idProfessor);
    }
}