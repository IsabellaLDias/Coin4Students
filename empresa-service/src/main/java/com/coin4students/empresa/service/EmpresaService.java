package com.coin4students.empresa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.coin4students.empresa.model.Empresa;
import com.coin4students.empresa.repository.EmpresaRepository;

@Service
public class EmpresaService {

    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository) {
        this.repository = repository;
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