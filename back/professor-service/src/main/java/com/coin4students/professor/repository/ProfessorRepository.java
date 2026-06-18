package com.coin4students.professor.repository;

import com.coin4students.professor.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmail(String email);
}