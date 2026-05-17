package com.coin4students.vantagem.service;

import com.coin4students.vantagem.model.Vantagem;
import com.coin4students.vantagem.repository.VantagemRepository;
import org.springframework.stereotype.Service;

import com.coin4students.vantagem.dto.ResgateDTO;
import com.coin4students.vantagem.model.Cupom;
import com.coin4students.vantagem.repository.CupomRepository;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

import java.util.List;

@Service
public class VantagemService {

    private final VantagemRepository repository;

    private final CupomRepository cupomRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final QRCodeService qrCodeService;

    public VantagemService(VantagemRepository repository, CupomRepository cupomRepository, QRCodeService qrCodeService) {
        this.repository = repository;
        this.cupomRepository = cupomRepository;
        this.qrCodeService = qrCodeService;
    }

    public Vantagem cadastrar(Vantagem vantagem) {
        return repository.save(vantagem);
    }

    public List<Vantagem> listar() {
        return repository.findAll();
    }

    public Cupom resgatar(Long idVantagem, ResgateDTO dto) {
        Vantagem vantagem = repository.findById(idVantagem)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        String url = "http://localhost:8080/alunos/"
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

        return cupomRepository.save(cupom);
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