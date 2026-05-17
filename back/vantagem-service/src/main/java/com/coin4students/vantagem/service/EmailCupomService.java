package com.coin4students.vantagem.service;

import com.coin4students.vantagem.model.Cupom;
import com.coin4students.vantagem.model.Vantagem;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class EmailCupomService {

    private final JavaMailSender mailSender;

    public EmailCupomService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCupomPorEmail(String emailAluno, Cupom cupom, Vantagem vantagem) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(emailAluno);
            helper.setSubject("Seu cupom foi gerado - Coin4Students");

            String corpoHtml =
                    "<h2>Seu cupom foi gerado com sucesso!</h2>" +
                    "<p><strong>Vantagem:</strong> " + vantagem.getTitulo() + "</p>" +
                    "<p><strong>Empresa:</strong> " + vantagem.getNomeEmpresa() + "</p>" +
                    "<p><strong>Código do cupom:</strong> " + cupom.getCodigo() + "</p>" +
                    "<p>Apresente o QR Code abaixo para resgatar sua vantagem:</p>" +
                    "<img src='cid:qrcode' style='width:220px;height:220px;' />" +
                    "<p>Status do cupom: <strong>Disponível para uso</strong>.</p>";

            helper.setText(corpoHtml, true);

            byte[] qrCodeBytes = Base64.getDecoder().decode(cupom.getQrCodeBase64());

            helper.addInline(
                    "qrcode",
                    new ByteArrayResource(qrCodeBytes),
                    "image/png"
            );

            mailSender.send(mensagem);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar cupom por e-mail", e);
        }
    }
}