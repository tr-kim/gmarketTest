package com.web.gmarket.common.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Component
public class JdbcTemplateProvider {

    private final Map<String, JdbcTemplate> jdbcTemplateMap = new ConcurrentHashMap<>();

    public JdbcTemplateProvider(DynamicDataSourceProperties properties) {
    	
        Map<String, DynamicDataSourceProperties.HikariSettings> configs = properties.getDatasource();

        for (Map.Entry<String, DynamicDataSourceProperties.HikariSettings> entry : configs.entrySet()) {
        	
            String dbName = entry.getKey();
            DynamicDataSourceProperties.HikariSettings.Hikari hikari = entry.getValue().getHikari();

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(hikari.getJdbcUrl());
            config.setUsername(hikari.getUsername());
            config.setPassword(hikari.getPassword());
            config.setDriverClassName(hikari.getDriverClassName());

            if (hikari.getMaximumPoolSize() != null)
                config.setMaximumPoolSize(hikari.getMaximumPoolSize());
            if (hikari.getMinimumIdle() != null)
                config.setMinimumIdle(hikari.getMinimumIdle());
            if (hikari.getPoolName() != null)
                config.setPoolName(hikari.getPoolName());

            HikariDataSource dataSource = new HikariDataSource(config);
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

            jdbcTemplateMap.put(dbName, jdbcTemplate);
        }
    }

    public JdbcTemplate getJdbcTemplate(String dbName) {
        JdbcTemplate template = jdbcTemplateMap.get(dbName);
        
        if (template == null) {
            throw new IllegalArgumentException("JdbcTemplate not found for DB: " + dbName);
        }
        
        return template;
    }
}