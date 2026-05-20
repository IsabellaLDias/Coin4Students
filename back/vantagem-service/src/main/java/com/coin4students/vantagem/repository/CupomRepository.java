package com.coin4students.vantagem.repository;

import com.coin4students.vantagem.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    Optional<Cupom> findByCodigo(String codigo);

    List<Cupom> findAllByOrderByIdDesc();

    List<Cupom> findByIdVantagemInOrderByIdDesc(List<Long> idsVantagens);

    List<Cupom> findByIdAlunoOrderByIdDesc(Long idAluno);

    boolean existsByIdVantagem(Long idVantagem);
}
