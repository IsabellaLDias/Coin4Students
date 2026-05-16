package com.coin4students.professor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.coin4students.professor.config.RabbitMQConfig;
import com.coin4students.professor.dto.EnvioMoedasDTO;
import com.coin4students.professor.dto.EnvioMoedasEvent;
import com.coin4students.professor.model.Professor;
import com.coin4students.professor.repository.ProfessorRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public ProfessorService(ProfessorRepository professorRepository, RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.professorRepository = professorRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public Professor cadastrar(Professor professor) {
        if (professor.getSaldoMoedas() == null) {
            professor.setSaldoMoedas(1000);
        }
        return professorRepository.save(professor);
    }

    public List<Professor> listar() {
        return professorRepository.findAll();
    }

    public Professor enviarMoedas(Long idProfessor, EnvioMoedasDTO dto) {
        Professor professor = professorRepository.findById(idProfessor)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
            throw new RuntimeException("A mensagem é obrigatória");
        }

        if (professor.getSaldoMoedas() < dto.getValor()) {
            throw new RuntimeException("Saldo insuficiente");
        }

        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.getValor());
        professorRepository.save(professor);

        EnvioMoedasEvent evento = new EnvioMoedasEvent(
                idProfessor,
                dto.getIdAluno(),
                dto.getValor(),
                dto.getMensagem()
        );

        try {
            String json = objectMapper.writeValueAsString(evento);
            rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_ENVIO_MOEDAS, json);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar mensagem para RabbitMQ", e);
        }

        return professor;
    }
}