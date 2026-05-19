package com.coin4students.professor.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String remetente;

    public EmailService(
        JavaMailSender mailSender,
        @Value("${spring.mail.username:}") String remetente
    ) {
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    public void enviarEmailProfessor(String email, Integer valor, String nomeAluno) {
        if (email == null || email.isBlank()) {
            return;
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(email);
        mensagem.setSubject("Confirmacao de envio de moedas - Coin4Students");
        mensagem.setText(
                "Ola, professor!\n\n" +
                "Confirmamos que voce enviou " + valor + " moedas para o aluno " + nomeAluno + ".\n\n" +
                "A transacao foi registrada com sucesso no sistema Coin4Students."
        );

        mailSender.send(mensagem);
        System.out.println("Email de confirmacao enviado para professor: " + email);
    }

    public void enviarEmailAluno(String email, Integer valor, String nomeProfessor, String mensagemProfessor) {
        if (email == null || email.isBlank()) {
            return;
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(email);
        mensagem.setSubject("Voce recebeu moedas! - Coin4Students");
        mensagem.setText(
                "Ola!\n\n" +
                "Voce recebeu " + valor + " moedas do professor " + nomeProfessor + ".\n\n" +
                "Mensagem do professor: " + mensagemProfessor + "\n\n" +
                "As moedas ja foram adicionadas ao seu saldo."
        );

        mailSender.send(mensagem);
        System.out.println("Email de recebimento enviado para aluno: " + email);
    }
}
