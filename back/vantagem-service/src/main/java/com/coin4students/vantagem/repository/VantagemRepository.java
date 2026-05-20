package com.coin4students.vantagem.repository;

import com.coin4students.vantagem.model.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

    List<Vantagem> findByNomeEmpresaIgnoreCase(String nomeEmpresa);
}
