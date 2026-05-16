package com.coin4students.professor.model;

import jakarta.persistence.*;

@Entity
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String departamento;
    private Integer saldoMoedas = 1000;

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public Integer getSaldoMoedas() {
        return saldoMoedas;
    }

    public void setSaldoMoedas(Integer saldoMoedas) {
        this.saldoMoedas = saldoMoedas;
    }
}