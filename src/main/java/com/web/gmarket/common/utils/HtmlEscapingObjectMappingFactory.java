package com.web.gmarket.common.utils;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * XSS Filter 사용 시 Request Raw Body로 넘어오는 JSON에 대한 필터 등록 
 * 
 */
@Configuration
public class HtmlEscapingObjectMappingFactory implements FactoryBean<ObjectMapper> {

    private final ObjectMapper objectMapper;
    
     // 3. ObjectMapper에 특수 문자 처리 기능 적용
    public HtmlEscapingObjectMappingFactory() {
        objectMapper = new ObjectMapper();
        objectMapper.getFactory().setCharacterEscapes(new HTMLCharacterEscapes());

    }

    @Override
    public ObjectMapper getObject() throws Exception {
        return objectMapper;
    }

    @Override
    public Class<?> getObjectType() {
        return objectMapper.getClass();
    }

    @Override
    public boolean isSingleton() {
        return true; // FactoryBean.super.isSingleton(); = true;
    }

}