package com.coin4students.vantagem.service;

import com.coin4students.vantagem.model.Vantagem;
import com.coin4students.vantagem.repository.VantagemRepository;
import org.springframework.stereotype.Service;

import com.coin4students.vantagem.dto.ResgateDTO;
import com.coin4students.vantagem.model.Cupom;
import com.coin4students.vantagem.repository.CupomRepository;
import org.springframework.web.client.RestTemplate;

import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VantagemService {

    private final VantagemRepository repository;

    @Value("${aluno.service.url:https://aluno-service-aqwz.onrender.com}")
    private String alunoServiceUrl;

    private final CupomRepository cupomRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final QRCodeService qrCodeService;

    private final EmailCupomService emailCupomService;

    public VantagemService(VantagemRepository repository, CupomRepository cupomRepository, QRCodeService qrCodeService, EmailCupomService emailCupomService) {
        this.repository = repository;
        this.cupomRepository = cupomRepository;
        this.qrCodeService = qrCodeService;
        this.emailCupomService = emailCupomService;
    }

    public Vantagem cadastrar(Vantagem vantagem) {
        return repository.save(vantagem);
    }

    public List<Vantagem> listar() {
        return repository.findAll();
    }

    public List<Cupom> listarResgates() {
        return cupomRepository.findAllByOrderByIdDesc();
    }

    public List<Cupom> listarResgatesPorEmpresa(String nomeEmpresa) {
        if (nomeEmpresa == null || nomeEmpresa.isBlank()) {
            return List.of();
        }

        List<Long> idsVantagens = repository.findByNomeEmpresaIgnoreCase(nomeEmpresa.trim())
                .stream()
                .map(Vantagem::getId)
                .collect(Collectors.toList());

        if (idsVantagens.isEmpty()) {
            return List.of();
        }

        return cupomRepository.findByIdVantagemInOrderByIdDesc(idsVantagens);
    }

    public List<Cupom> listarResgatesPorAluno(Long idAluno) {
        return cupomRepository.findByIdAlunoOrderByIdDesc(idAluno);
    }

    public Cupom buscarCupomPorCodigo(String codigo) {
        return cupomRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Cupom nao encontrado"));
    }

    public Vantagem atualizar(Long id, Vantagem dadosAtualizados) {
        if (cupomRepository.existsByIdVantagem(id)) {
            throw new RuntimeException("Vantagem ja foi resgatada e nao pode ser editada");
        }

        Vantagem vantagem = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vantagem nao encontrada"));

        vantagem.setTitulo(dadosAtualizados.getTitulo());
        vantagem.setDescricao(dadosAtualizados.getDescricao());
        vantagem.setCustoMoedas(dadosAtualizados.getCustoMoedas());
        vantagem.setNomeEmpresa(dadosAtualizados.getNomeEmpresa());
        vantagem.setImagemUrl(dadosAtualizados.getImagemUrl());

        return repository.save(vantagem);
    }

    public Cupom resgatar(Long idVantagem, ResgateDTO dto) {
        Vantagem vantagem = repository.findById(idVantagem)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        String url = alunoServiceUrl + "/alunos/"
                + dto.getIdAluno()
                + "/remover-moedas?valor="
                + vantagem.getCustoMoedas();

        restTemplate.put(url, null);

        Cupom cupom = new Cupom();
        cupom.setIdAluno(dto.getIdAluno());
        cupom.setIdVantagem(idVantagem);
        cupom.setCodigo(UUID.randomUUID().toString());
        cupom.setUtilizado(false);

        String qrCode = qrCodeService.gerarQRCodeBase64(cupom.getCodigo());
        cupom.setQrCodeBase64(qrCode);

        Cupom cupomSalvo = cupomRepository.save(cupom);

        try {
            emailCupomService.enviarCupomPorEmail(
                    dto.getEmailAluno(),
                    cupomSalvo,
                    vantagem
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email do cupom: " + e.getMessage());
        }

        return cupomSalvo;
    }

    public Cupom validarCupom(String codigo) {

        Cupom cupom = cupomRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        if (cupom.getUtilizado()) {
            throw new RuntimeException("Cupom já utilizado");
        }

        cupom.setUtilizado(true);

        return cupomRepository.save(cupom);
    }
}
