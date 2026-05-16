package com.coin4students.transacao.consumer;

import com.coin4students.transacao.config.RabbitMQConfig;
import com.coin4students.transacao.dto.EnvioMoedasEvent;
import com.coin4students.transacao.service.TransacaoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EnvioMoedasConsumer {

    private final TransacaoService service;
    private final ObjectMapper objectMapper;

    public EnvioMoedasConsumer(TransacaoService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_ENVIO_MOEDAS)
    public void consumirEnvioMoedas(String mensagemJson) throws Exception {
        EnvioMoedasEvent evento = objectMapper.readValue(mensagemJson, EnvioMoedasEvent.class);

        service.registrarEnvioMoedas(evento);

        System.out.println("Transação registrada: Professor "
                + evento.getIdProfessor()
                + " enviou "
                + evento.getValor()
                + " moedas para aluno "
                + evento.getIdAluno());
    }
}