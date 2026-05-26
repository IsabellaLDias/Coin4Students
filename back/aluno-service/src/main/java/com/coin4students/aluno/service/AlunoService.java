package com.coin4students.aluno.service;

import com.coin4students.aluno.model.Aluno;
import com.coin4students.aluno.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository repository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${transacao.service.url:https://transacao-service-hc98.onrender.com}")
    private String transacaoServiceUrl;

    public AlunoService(AlunoRepository repository) {
        this.repository = repository;
    }

    public Aluno salvar(Aluno aluno) {
        return repository.save(aluno);
    }

    public List<Aluno> listar() {
        return repository.findAll();
    }

    public List<?> extrato(Long idAluno) {
        if (transacaoServiceUrl == null || transacaoServiceUrl.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return restTemplate.getForObject(
                    transacaoServiceUrl + "/transacoes/extrato/aluno/" + idAluno,
                    List.class
            );
        } catch (Exception e) {
            System.err.println("Erro ao buscar extrato do aluno: " + e.getMessage());
            return Collections.emptyList();
        }
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

    public Aluno removerMoedas(Long id, Integer valor) {
        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (aluno.getSaldoMoedas() == null) {
            aluno.setSaldoMoedas(0);
        }

        if (aluno.getSaldoMoedas() < valor) {
            throw new RuntimeException("Saldo insuficiente");
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - valor);

        return repository.save(aluno);
    }
}
