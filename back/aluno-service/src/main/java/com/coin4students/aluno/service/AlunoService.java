package com.coin4students.aluno.service;

import com.coin4students.aluno.model.Aluno;
import com.coin4students.aluno.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository repository;

    public AlunoService(AlunoRepository repository) {
        this.repository = repository;
    }

    public Aluno salvar(Aluno aluno) {
        return repository.save(aluno);
    }

    public List<Aluno> listar() {
        return repository.findAll();
    }

    public Aluno buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    public Aluno atualizar(Long id, Aluno alunoAtualizado) {
        Aluno aluno = buscarPorId(id);

        aluno.setNome(alunoAtualizado.getNome());
        aluno.setEmail(alunoAtualizado.getEmail());
        aluno.setSenha(alunoAtualizado.getSenha());
        aluno.setCpf(alunoAtualizado.getCpf());
        aluno.setRg(alunoAtualizado.getRg());
        aluno.setEndereco(alunoAtualizado.getEndereco());
        aluno.setCurso(alunoAtualizado.getCurso());
        aluno.setSaldoMoedas(alunoAtualizado.getSaldoMoedas());

        return repository.save(aluno);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public Aluno adicionarMoedas(Long id, Integer valor) {

        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (aluno.getSaldoMoedas() == null) {
            aluno.setSaldoMoedas(0);
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + valor);

        return repository.save(aluno);
    }
}