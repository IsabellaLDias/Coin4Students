package com.coin4students.professor.service;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
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
        String destinatario = normalizarEmail(email);
        if (destinatario == null) {
            System.err.println("Email do professor ausente ou invalido: " + email);
            return;
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        aplicarRemetente(mensagem);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Confirmacao de envio de moedas - Coin4Students");
        mensagem.setText(
                "Ola, professor!\n\n" +
                "Confirmamos que voce enviou " + valor + " moedas para o aluno " + nomeAluno + ".\n\n" +
                "A transacao foi registrada com sucesso no sistema Coin4Students."
        );

        mailSender.send(mensagem);
        System.out.println("Email de confirmacao enviado para professor: " + destinatario);
    }

    public void enviarEmailAluno(String email, Integer valor, String nomeProfessor, String mensagemProfessor) {
        String destinatario = normalizarEmail(email);
        if (destinatario == null) {
            System.err.println("Email do aluno ausente ou invalido: " + email);
            return;
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        aplicarRemetente(mensagem);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Voce recebeu moedas! - Coin4Students");
        mensagem.setText(
                "Ola!\n\n" +
                "Voce recebeu " + valor + " moedas do professor " + nomeProfessor + ".\n\n" +
                "Mensagem do professor: " + mensagemProfessor + "\n\n" +
                "As moedas ja foram adicionadas ao seu saldo."
        );

        mailSender.send(mensagem);
        System.out.println("Email de recebimento enviado para aluno: " + destinatario);
    }

    private void aplicarRemetente(SimpleMailMessage mensagem) {
        String emailRemetente = normalizarEmail(remetente);
        if (emailRemetente != null) {
            mensagem.setFrom(emailRemetente);
        }
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        String emailNormalizado = email.trim();

        try {
            InternetAddress endereco = new InternetAddress(emailNormalizado);
            endereco.validate();
            return emailNormalizado;
        } catch (AddressException e) {
            return null;
        }
    }
}
