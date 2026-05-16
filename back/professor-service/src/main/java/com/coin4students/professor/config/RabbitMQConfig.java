package com.coin4students.professor.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FILA_ENVIO_MOEDAS = "fila.envio.moedas";

    @Bean
    public Queue filaEnvioMoedas() {
        return new Queue(FILA_ENVIO_MOEDAS, true);
    }
}