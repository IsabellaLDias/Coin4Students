package com.coin4students.transacao.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    private static final String RESEND_EMAILS_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String remetente;

    public EmailService(
        @Value("${resend.api.key:}") String apiKey,
        @Value("${resend.from:Coin4Students <onboarding@resend.dev>}") String remetente
    ) {
        this.apiKey = apiKey;
        this.remetente = remetente;
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
            throw new RuntimeException("RESEND_API_KEY nao configurada");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResendEmailRequest body = new ResendEmailRequest(
                remetente,
                new String[] { destinatario },
                assunto,
                texto.replace("\n", "<br>")
        );

        restTemplate.postForEntity(
                RESEND_EMAILS_URL,
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

    static class ResendEmailRequest {
        private final String from;
        private final String[] to;
        private final String subject;
        private final String html;

        ResendEmailRequest(String from, String[] to, String subject, String html) {
            this.from = from;
            this.to = to;
            this.subject = subject;
            this.html = html;
        }

        public String getFrom() {
            return from;
        }

        public String[] getTo() {
            return to;
        }

        public String getSubject() {
            return subject;
        }

        @JsonProperty("html")
        public String getHtml() {
            return html;
        }
    }
}
