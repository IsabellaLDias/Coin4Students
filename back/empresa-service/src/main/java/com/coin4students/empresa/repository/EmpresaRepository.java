package com.coin4students.empresa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coin4students.empresa.model.Empresa;
import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByEmail(String email);
}