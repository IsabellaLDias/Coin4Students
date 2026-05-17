package com.coin4students.vantagem.model;

import jakarta.persistence.*;

@Entity
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idAluno;

    private Long idVantagem;

    private String codigo;

    private Boolean utilizado;

    @Column(columnDefinition = "TEXT")
    private String qrCodeBase64;
    
    public Cupom() {
    }

    public Long getId() {
        return id;
    }

    public Long getIdAluno() {
        return idAluno;
    }

    public void setIdAluno(Long idAluno) {
        this.idAluno = idAluno;
    }

    public Long getIdVantagem() {
        return idVantagem;
    }

    public void setIdVantagem(Long idVantagem) {
        this.idVantagem = idVantagem;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Boolean getUtilizado() {
        return utilizado;
    }

    public void setUtilizado(Boolean utilizado) {
        this.utilizado = utilizado;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }
}