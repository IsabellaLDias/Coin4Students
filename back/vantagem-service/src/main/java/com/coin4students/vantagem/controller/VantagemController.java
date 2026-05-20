package com.coin4students.vantagem.controller;

import com.coin4students.vantagem.model.Vantagem;
import com.coin4students.vantagem.service.VantagemService;
import org.springframework.web.bind.annotation.*;

import com.coin4students.vantagem.dto.ResgateDTO;
import com.coin4students.vantagem.model.Cupom;

import java.util.List;

@RestController
@RequestMapping("/vantagens")
@CrossOrigin(origins = "*")
public class VantagemController {

    private final VantagemService service;

    public VantagemController(VantagemService service) {
        this.service = service;
    }

    @PostMapping
    public Vantagem cadastrar(@RequestBody Vantagem vantagem) {
        return service.cadastrar(vantagem);
    }

    @GetMapping
    public List<Vantagem> listar() {
        return service.listar();
    }

    @GetMapping("/resgates")
    public List<Cupom> listarResgates() {
        return service.listarResgates();
    }

    @GetMapping("/resgates/empresa")
    public List<Cupom> listarResgatesPorEmpresa(@RequestParam String nomeEmpresa) {
        return service.listarResgatesPorEmpresa(nomeEmpresa);
    }

    @PutMapping("/{id}")
    public Vantagem atualizar(@PathVariable Long id, @RequestBody Vantagem vantagem) {
        return service.atualizar(id, vantagem);
    }

    @PostMapping("/{idVantagem}/resgatar")
    public Cupom resgatar(
            @PathVariable Long idVantagem,
            @RequestBody ResgateDTO dto
    ) {
        return service.resgatar(idVantagem, dto);
    }

    @PutMapping("/validar")
    public Cupom validar(@RequestParam String codigo) {
        return service.validarCupom(codigo);
    }
}
