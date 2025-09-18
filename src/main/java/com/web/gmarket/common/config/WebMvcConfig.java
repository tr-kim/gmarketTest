package com.web.gmarket.common.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.web.gmarket.common.utils.HtmlEscapingObjectMappingFactory;


/**
 * XSS Filter 사용 시 Request Raw Body로 넘어오는 JSON에 대한 필터 등록 
 * 
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	private final HtmlEscapingObjectMappingFactory objectMappingFactory;

	public WebMvcConfig(HtmlEscapingObjectMappingFactory objectMappingFactory) {
		this.objectMappingFactory = objectMappingFactory;
	}

	@Override
	public void configureMessageConverters(@NonNull List<HttpMessageConverter<?>> converters) {

		try {
			MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter(
					objectMappingFactory.getObject());

			converter.setSupportedMediaTypes(
					List.of(MediaType.APPLICATION_JSON, MediaType.valueOf("text/html;charset=UTF-8")));

			converters.add(converter);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("XSS 필터링용 ObjectMapper 생성 실패", e);
		}
	}
}
