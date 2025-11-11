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
	
//	@Bean
//    ObjectMapper objectMapper() {
//        ObjectMapper mapper = new ObjectMapper();
//
//        // HTML escape 비활성화
//        mapper.getFactory().setCharacterEscapes(new CharacterEscapes() {
//
//            private final int[] asciiEscapes = CharacterEscapes.standardAsciiEscapesForJSON();
//
//            @Override
//            public int[] getEscapeCodesForAscii() {
//                // 모든 ASCII 문자 escape하지 않도록
//                return asciiEscapes;
//            }
//
//            @Override
//            public SerializableString getEscapeSequence(int ch) {
//                // null 리턴 = escape 없음
//                return null;
//            }
//        });
//
//        return mapper;
//    }

    @Bean
    public ObjectMapper objectMapper() throws Exception {
        return new HtmlEscapingObjectMappingFactory().getObject();
    }
	
	
}
