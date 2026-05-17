package com.coin4students.aluno.controller;

import com.coin4students.aluno.model.Aluno;
import com.coin4students.aluno.service.AlunoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/alunos")
public class AlunoController {

    private final AlunoService service;

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    @PostMapping
    public Aluno criar(@RequestBody Aluno aluno) {
        return service.salvar(aluno);
    }

    @GetMapping
    public List<Aluno> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Aluno buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Aluno atualizar(@PathVariable Long id, @RequestBody Aluno aluno) {
        return service.atualizar(id, aluno);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @PutMapping("/{id}/adicionar-moedas")
    public Aluno adicionarMoedas(
            @PathVariable Long id,
            @RequestParam Integer valor
    ) {
        return service.adicionarMoedas(id, valor);
    }

    @PutMapping("/{id}/remover-moedas")
    public Aluno removerMoedas(
            @PathVariable Long id,
            @RequestParam Integer valor
    ) {
        return service.removerMoedas(id, valor);
    }
}