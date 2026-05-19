package com.coin4students.transacao.service;

import com.coin4students.transacao.dto.EnvioMoedasEvent;
import com.coin4students.transacao.model.Transacao;
import com.coin4students.transacao.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;

    public TransacaoService(TransacaoRepository repository) {
        this.repository = repository;
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

        return transacaoSalva;
    }

    public List<Transacao> extratoAluno(Long idAluno) {
        return repository.findByIdAluno(idAluno);
    }

    public List<Transacao> extratoProfessor(Long idProfessor) {
        return repository.findByIdProfessor(idProfessor);
    }
}
