package com.coin4students.transacao.repository;

import com.coin4students.transacao.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByIdAluno(Long idAluno);

    List<Transacao> findByIdProfessor(Long idProfessor);
}