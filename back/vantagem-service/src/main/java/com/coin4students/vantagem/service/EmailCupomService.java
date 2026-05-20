package com.coin4students.vantagem.service;

import com.coin4students.vantagem.model.Cupom;
import com.coin4students.vantagem.model.Vantagem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailCupomService {

    private static final String BREVO_EMAILS_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String remetenteEmail;
    private final String remetenteNome;

    public EmailCupomService(
            @Value("${brevo.api.key:}") String apiKey,
            @Value("${brevo.from.email:isabellamg2017@gmail.com}") String remetenteEmail,
            @Value("${brevo.from.name:coin4students}") String remetenteNome
    ) {
        this.apiKey = apiKey;
        this.remetenteEmail = remetenteEmail;
        this.remetenteNome = remetenteNome;
    }

    public void enviarCupomPorEmail(String emailAluno, Cupom cupom, Vantagem vantagem) {
        String destinatario = normalizarEmail(emailAluno);
        if (destinatario == null) {
            System.err.println("Email do aluno ausente ou invalido para envio de cupom: " + emailAluno);
            return;
        }

        String html =
                "<h2>Seu cupom foi gerado com sucesso!</h2>" +
                "<p><strong>Vantagem:</strong> " + escaparHtml(vantagem.getTitulo()) + "</p>" +
                "<p><strong>Empresa:</strong> " + escaparHtml(vantagem.getNomeEmpresa()) + "</p>" +
                "<p><strong>Codigo do cupom:</strong> " + escaparHtml(cupom.getCodigo()) + "</p>" +
                "<p>Apresente o QR Code abaixo para resgatar sua vantagem:</p>" +
                "<img src=\"data:image/png;base64," + cupom.getQrCodeBase64() + "\" style=\"width:220px;height:220px;\" />" +
                "<p>Status do cupom: <strong>Disponivel para uso</strong>.</p>";

        enviarEmail(destinatario, "Seu cupom foi gerado - Coin4Students", html);
        System.out.println("Email de cupom enviado para aluno: " + destinatario);
    }

    private void enviarEmail(String destinatario, String assunto, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("BREVO_API_KEY nao configurada");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        BrevoEmailRequest body = new BrevoEmailRequest(
                new BrevoSender(remetenteNome, remetenteEmail),
                new BrevoRecipient[] { new BrevoRecipient(destinatario) },
                assunto,
                html
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

    private String escaparHtml(String valor) {
        if (valor == null) {
            return "";
        }

        return valor
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#039;");
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
