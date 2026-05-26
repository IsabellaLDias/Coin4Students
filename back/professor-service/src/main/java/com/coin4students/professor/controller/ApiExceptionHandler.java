package com.coin4students.professor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> tratarResponseStatusException(ResponseStatusException exception) {
        Map<String, Object> erro = new LinkedHashMap<>();
        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", exception.getStatusCode().value());
        erro.put("error", exception.getStatusCode().toString());
        erro.put("message", exception.getReason());

        return ResponseEntity.status(exception.getStatusCode()).body(erro);
    }
}
