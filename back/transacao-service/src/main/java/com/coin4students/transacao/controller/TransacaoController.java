package com.coin4students.transacao.controller;

import com.coin4students.transacao.model.Transacao;
import com.coin4students.transacao.service.TransacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    private final TransacaoService service;

    public TransacaoController(TransacaoService service) {
        this.service = service;
    }

    @GetMapping("/extrato/aluno/{idAluno}")
    public List<Transacao> extratoAluno(@PathVariable Long idAluno) {
        return service.extratoAluno(idAluno);
    }

    @GetMapping("/extrato/professor/{idProfessor}")
    public List<Transacao> extratoProfessor(@PathVariable Long idProfessor) {
        return service.extratoProfessor(idProfessor);
    }
}