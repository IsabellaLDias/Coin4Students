package com.coin4students.transacao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    private static final String BREVO_EMAILS_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String remetenteNome;
    private final String remetenteEmail;

    public EmailService(
        @Value("${brevo.api.key:}") String apiKey,
        @Value("${brevo.from.name:Coin4Students}") String remetenteNome,
        @Value("${brevo.from.email:}") String remetenteEmail
    ) {
        this.apiKey = apiKey;
        this.remetenteNome = remetenteNome;
        this.remetenteEmail = remetenteEmail;
    }

    public void enviarEmailProfessor(String email, Integer valor, String nomeAluno) {
        String destinatario = normalizarEmail(email);
        if (destinatario == null) {
            System.err.println("Email do professor ausente ou invalido: " + email);
            return;
        }

        enviarEmail(
                destinatario,
                "Confirmacao de envio de moedas - Coin4Students",
                "Ola, professor!\n\n" +
                        "Confirmamos que voce enviou " + valor + " moedas para o aluno " + nomeAluno + ".\n\n" +
                        "A transacao foi registrada com sucesso no sistema Coin4Students."
        );

        System.out.println("Email de confirmacao enviado para professor: " + destinatario);
    }

    public void enviarEmailAluno(String email, Integer valor, String nomeProfessor, String mensagemProfessor) {
        String destinatario = normalizarEmail(email);
        if (destinatario == null) {
            System.err.println("Email do aluno ausente ou invalido: " + email);
            return;
        }

        enviarEmail(
                destinatario,
                "Voce recebeu moedas! - Coin4Students",
                "Ola!\n\n" +
                        "Voce recebeu " + valor + " moedas do professor " + nomeProfessor + ".\n\n" +
                        "Mensagem do professor: " + mensagemProfessor + "\n\n" +
                        "As moedas ja foram adicionadas ao seu saldo."
        );

        System.out.println("Email de recebimento enviado para aluno: " + destinatario);
    }

    private void enviarEmail(String destinatario, String assunto, String texto) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("BREVO_API_KEY nao configurada");
        }

        if (normalizarEmail(remetenteEmail) == null) {
            throw new RuntimeException("BREVO_FROM_EMAIL ausente ou invalido");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        BrevoEmailRequest body = new BrevoEmailRequest(
                new BrevoSender(remetenteNome, remetenteEmail.trim()),
                new BrevoRecipient[] { new BrevoRecipient(destinatario) },
                assunto,
                texto.replace("\n", "<br>")
        );

        restTemplate.postForEntity(
                BREVO_EMAILS_URL,
                new HttpEntity<>(body, headers),
                String.class
        );
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        String emailNormalizado = email.trim();

        if (!emailNormalizado.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            return null;
        }

        return emailNormalizado;
    }

    static class BrevoEmailRequest {
        private final BrevoSender sender;
        private final BrevoRecipient[] to;
        private final String subject;
        private final String htmlContent;

        BrevoEmailRequest(BrevoSender sender, BrevoRecipient[] to, String subject, String htmlContent) {
            this.sender = sender;
            this.to = to;
            this.subject = subject;
            this.htmlContent = htmlContent;
        }

        public BrevoSender getSender() {
            return sender;
        }

        public BrevoRecipient[] getTo() {
            return to;
        }

        public String getSubject() {
            return subject;
        }

        public String getHtmlContent() {
            return htmlContent;
        }
    }

    static class BrevoSender {
        private final String name;
        private final String email;

        BrevoSender(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }
    }

    static class BrevoRecipient {
        private final String email;

        BrevoRecipient(String email) {
            this.email = email;
        }

        public String getEmail() {
            return email;
        }
    }
}
