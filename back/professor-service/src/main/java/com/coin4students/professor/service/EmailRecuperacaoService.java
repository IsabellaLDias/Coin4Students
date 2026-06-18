package com.coin4students.professor.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailRecuperacaoService {

    private static final String BREVO_EMAILS_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String remetenteEmail;
    private final String remetenteNome;
    private final String logoUrl;

    public EmailRecuperacaoService(
        @Value("${brevo.api.key:}") String apiKey,
        @Value("${brevo.from.email:isabellamg2017@gmail.com}") String remetenteEmail,
        @Value("${brevo.from.name:coin4students}") String remetenteNome,
        @Value("${brevo.logo.url:}") String logoUrl
    ) {
        this.apiKey = limparConfiguracao(apiKey);
        this.remetenteEmail = limparConfiguracao(remetenteEmail);
        this.remetenteNome = limparConfiguracao(remetenteNome);
        this.logoUrl = limparConfiguracao(logoUrl);
    }

    public void enviarEmailRecuperacao(String email, String novaSenhaTemporaria, String nomeUsuario) {
        String destinatario = normalizarEmail(email);
        if (destinatario == null) {
            System.err.println("Email ausente ou invalido: " + email);
            return;
        }

        String html = montarEmailRecuperacao(
                "Recuperação de Senha",
                "Você solicitou a redefinição da sua senha.",
                "Nova Senha Temporária",
                novaSenhaTemporaria,
                new String[][] {
                        { "Usuário", nomeUsuario },
                        { "Ação", "Faça login com a senha acima e altere-a no seu perfil." }
                },
                "Se você não solicitou esta alteração, ignore este e-mail."
        );

        enviarEmail(destinatario, "Recuperação de Senha - Coin4Students", html);
        System.out.println("Email de recuperacao enviado para: " + destinatario);
    }

    private String montarEmailRecuperacao(
            String titulo,
            String subtitulo,
            String destaqueLabel,
            String destaqueValor,
            String[][] linhas,
            String rodape
    ) {
        StringBuilder detalhes = new StringBuilder();
        for (String[] linha : linhas) {
            detalhes.append(linhaDetalhe(linha[0], linha[1]));
        }

        return templateBase(
                titulo,
                subtitulo,
                """
                <tr>
                    <td style="padding: 0 28px 20px;">
                        <div style="border-radius: 8px; background: linear-gradient(135deg, #1b5e20, #2e7d32); padding: 24px; color: #ffffff;">
                            <div style="font-size: 13px; font-weight: 700; opacity: .82;">%s</div>
                            <div style="font-size: 34px; line-height: 1.1; font-weight: 900; margin-top: 6px;">%s</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 28px 22px;">
                        <div style="border: 1px solid #dfe8df; border-radius: 8px; overflow: hidden;">
                            %s
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 28px 30px; color: #66756b; font-size: 14px; line-height: 1.6;">
                        %s
                    </td>
                </tr>
                """.formatted(
                        escaparHtml(destaqueLabel),
                        escaparHtml(destaqueValor),
                        detalhes,
                        escaparHtml(rodape)
                )
        );
    }

    private String templateBase(String titulo, String subtitulo, String conteudo) {
        return """
        <!doctype html>
        <html lang="pt-br">
        <body style="margin:0; padding:0; background:#f3fbf4; font-family: Segoe UI, Arial, sans-serif; color:#1f2a24;">
            <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f3fbf4; padding: 28px 12px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width: 620px; background:#ffffff; border-radius: 8px; overflow:hidden; border:1px solid #dfe8df; box-shadow: 0 12px 34px rgba(27,94,32,.12);">
                            <tr>
                                <td style="padding: 26px 28px; background:#ffffff; border-bottom:1px solid #dfe8df;">
                                    %s
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 28px 28px 18px;">
                                    <div style="display:inline-block; padding:7px 10px; border-radius:999px; color:#256d2b; background:#e8f5e9; font-size:12px; font-weight:800; text-transform:uppercase;">Coin4Students</div>
                                    <h1 style="margin:14px 0 8px; font-size:28px; line-height:1.15; color:#1f2a24;">%s</h1>
                                    <p style="margin:0; color:#66756b; font-size:15px; line-height:1.6;">%s</p>
                                </td>
                            </tr>
                            %s
                            <tr>
                                <td style="padding: 18px 28px; background:#fff7d6; color:#66756b; font-size:12px; line-height:1.5;">
                                    Este é um e-mail automático do Coin4Students.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """.formatted(marcaHtml(), escaparHtml(titulo), escaparHtml(subtitulo), conteudo);
    }

    private String marcaHtml() {
        if (logoUrl != null && !logoUrl.isBlank()) {
            return """
            <img src="%s" alt="Coin4Students" style="height:54px; display:block;">
            """.formatted(escaparHtml(logoUrl));
        }

        return """
        <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:48px; height:48px; border-radius:8px; background:#2e7d32; color:#fff7d6; font-weight:900; text-align:center; vertical-align:middle;">C4S</td>
                <td style="padding-left:12px;">
                    <div style="font-size:22px; font-weight:900; color:#256d2b; line-height:1;">Coin4Students</div>
                    <div style="font-size:12px; color:#d6b642; font-weight:800; margin-top:4px;">moedas que reconhecem conquistas</div>
                </td>
            </tr>
        </table>
        """;
    }

    private String linhaDetalhe(String label, String valor) {
        return """
        <div style="padding:14px 16px; border-bottom:1px solid #dfe8df;">
            <div style="font-size:12px; color:#66756b; font-weight:800; text-transform:uppercase;">%s</div>
            <div style="font-size:15px; color:#1f2a24; margin-top:4px; line-height:1.45;">%s</div>
        </div>
        """.formatted(escaparHtml(label), escaparHtml(valor));
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

        try {
            restTemplate.postForEntity(BREVO_EMAILS_URL, new HttpEntity<>(body, headers), String.class);
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new RuntimeException(
                    "BREVO_API_KEY invalida ou sem permissao para enviar e-mail pela API HTTP da Brevo",
                    e
            );
        }
    }

    private String limparConfiguracao(String valor) {
        if (valor == null) return "";
        String valorLimpo = valor.trim();

        if ((valorLimpo.startsWith("\"") && valorLimpo.endsWith("\""))
                || (valorLimpo.startsWith("'") && valorLimpo.endsWith("'"))) {
            return valorLimpo.substring(1, valorLimpo.length() - 1).trim();
        }

        return valorLimpo;
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) return null;
        String emailNormalizado = email.trim();
        if (!emailNormalizado.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) return null;
        return emailNormalizado;
    }

    private String escaparHtml(String valor) {
        if (valor == null) return "";
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

        public BrevoSender getSender() { return sender; }
        public BrevoRecipient[] getTo() { return to; }
        public String getSubject() { return subject; }
        public String getHtmlContent() { return htmlContent; }
    }

    static class BrevoSender {
        private final String name;
        private final String email;

        BrevoSender(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public String getName() { return name; }
        public String getEmail() { return email; }
    }

    static class BrevoRecipient {
        private final String email;

        BrevoRecipient(String email) {
            this.email = email;
        }

        public String getEmail() { return email; }
    }
}
