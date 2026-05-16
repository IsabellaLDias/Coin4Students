package com.coin4students.professor.controller;

import com.coin4students.professor.dto.EnvioMoedasDTO;
import com.coin4students.professor.model.Professor;
import com.coin4students.professor.service.ProfessorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @PostMapping
    public Professor cadastrar(@RequestBody Professor professor) {
        return professorService.cadastrar(professor);
    }

    @GetMapping
    public List<Professor> listar() {
        return professorService.listar();
    }

    @PostMapping("/{idProfessor}/enviar-moedas")
    public Professor enviarMoedas(
            @PathVariable Long idProfessor,
            @RequestBody EnvioMoedasDTO dto
    ) {
        return professorService.enviarMoedas(idProfessor, dto);
    }
}