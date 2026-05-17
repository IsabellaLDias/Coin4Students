package com.coin4students.professor.dto;

import java.io.Serializable;

public class EnvioMoedasEvent implements Serializable {

    private Long idProfessor;
    private Long idAluno;
    private Integer valor;
    private String mensagem;
    private String emailProfessor;
    private String emailAluno;
    private String nomeProfessor;
    private String nomeAluno;

    public EnvioMoedasEvent() {
    }

    public EnvioMoedasEvent(Long idProfessor, Long idAluno, Integer valor, String mensagem) {
        this.idProfessor = idProfessor;
        this.idAluno = idAluno;
        this.valor = valor;
        this.mensagem = mensagem;
        this.nomeProfessor = nomeProfessor;
        this.nomeAluno = nomeAluno;
    }

    public Long getIdProfessor() {
        return idProfessor;
    }

    public void setIdProfessor(Long idProfessor) {
        this.idProfessor = idProfessor;
    }

    public Long getIdAluno() {
        return idAluno;
    }

    public void setIdAluno(Long idAluno) {
        this.idAluno = idAluno;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getEmailProfessor() {
        return emailProfessor;
    }

    public void setEmailProfessor(String emailProfessor) {
        this.emailProfessor = emailProfessor;
    }

    public String getEmailAluno() {
        return emailAluno;
    }

    public void setEmailAluno(String emailAluno) {
        this.emailAluno = emailAluno;
    }

    public String getNomeProfessor() {
        return nomeProfessor;
    }

    public void setNomeProfessor(String nomeProfessor) {
        this.nomeProfessor = nomeProfessor;
    }

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }
}