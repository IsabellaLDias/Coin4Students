package com.coin4students.transacao.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmailProfessor(
        String email,
        Integer valor,
        String nomeAluno
) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Confirmação de envio de moedas - Coin4Students");
        mensagem.setText(
                "Olá, professor!\n\n" +
                "Confirmamos que você enviou " + valor + " moedas para o aluno " + nomeAluno + ".\n\n" +
                "A transação foi registrada com sucesso no sistema Coin4Students."
        );

        mailSender.send(mensagem);
    }

    public void enviarEmailAluno(String email, Integer valor, String nomeProfessor, String mensagemProfessor) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Você recebeu moedas! - Coin4Students");
        mensagem.setText(
                "Olá!\n\n" +
                "Você recebeu " + valor + " moedas do professor " + nomeProfessor + ".\n\n" +
                "Mensagem do professor: " + mensagemProfessor + "\n\n" +
                "As moedas já foram adicionadas ao seu saldo."
        );

        mailSender.send(mensagem);
    }
}