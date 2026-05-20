package com.coin4students.vantagem.model;

import jakarta.persistence.*;

@Entity
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    private Integer custoMoedas;

    private String nomeEmpresa;

    @Column(columnDefinition = "TEXT")
    private String imagemUrl;

    public Vantagem() {
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getCustoMoedas() {
        return custoMoedas;
    }

    public void setCustoMoedas(Integer custoMoedas) {
        this.custoMoedas = custoMoedas;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
}
