package com.coin4students.transacao.dto;

public class EnvioMoedasEvent {

    private Long idProfessor;
    private Long idAluno;
    private Integer valor;
    private String mensagem;

    public EnvioMoedasEvent() {
    }

    public EnvioMoedasEvent(Long idProfessor, Long idAluno, Integer valor, String mensagem) {
        this.idProfessor = idProfessor;
        this.idAluno = idAluno;
        this.valor = valor;
        this.mensagem = mensagem;
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
}