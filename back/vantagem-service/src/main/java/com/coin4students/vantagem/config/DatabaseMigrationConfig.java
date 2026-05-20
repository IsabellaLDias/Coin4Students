package com.coin4students.vantagem.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationConfig {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void aplicarMigracoes() {
        jdbcTemplate.execute("ALTER TABLE vantagem ADD COLUMN IF NOT EXISTS imagem_url TEXT");
    }
}
