package com.coin4students.empresa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.coin4students.empresa.model.Empresa;
import com.coin4students.empresa.repository.EmpresaRepository;

@Service
public class EmpresaService {

    private final EmpresaRepository repository;
    private final EmailRecuperacaoService emailRecuperacaoService;

    public EmpresaService(EmpresaRepository repository, EmailRecuperacaoService emailRecuperacaoService) {
        this.repository = repository;
        this.emailRecuperacaoService = emailRecuperacaoService;
    }

    public void recuperarSenha(String email) {
        repository.findByEmail(email).ifPresent(empresa -> {
            String novaSenha = java.util.UUID.randomUUID().toString().substring(0, 8);
            empresa.setSenha(novaSenha);
            repository.save(empresa);
            emailRecuperacaoService.enviarEmailRecuperacao(email, novaSenha, empresa.getNome());
        });
    }

    public Empresa salvar(Empresa empresa) {
        return repository.save(empresa);
    }

    public List<Empresa> listar() {
        return repository.findAll();
    }

    public Empresa buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
    }

    public Empresa atualizar(Long id, Empresa empresaAtualizada) {
        Empresa empresa = buscarPorId(id);

        empresa.setNome(empresaAtualizada.getNome());
        empresa.setEmail(empresaAtualizada.getEmail());
        empresa.setSenha(empresaAtualizada.getSenha());
        empresa.setCnpj(empresaAtualizada.getCnpj());

        return repository.save(empresa);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}