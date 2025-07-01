package com.web.gmarket.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.gmarket.common.utils.HtmlEscapingObjectMappingFactory;

/**
 * XSS Filter 사용 시 Request Raw Body로 넘어오는 JSON에 대한 필터 등록 
 * 
 */
@Configuration
public class ObjectMapperConfig {

    @Bean
    public ObjectMapper objectMapper() throws Exception {
        return new HtmlEscapingObjectMappingFactory().getObject();
    }
}
