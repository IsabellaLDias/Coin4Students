package com.coin4students.vantagem.controller;

import br.com.vaicomigo.infra.security.UsuarioAutenticado;
import br.com.vaicomigo.usuarios.api.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/ping")
@RequiredArgsConstructor
public class PingController {

    @GetMapping
    public ResponseEntity<String> ping() {
        log.info("Ping recebido no backend!");
        return ResponseEntity.ok("Acordado!");
    }
}