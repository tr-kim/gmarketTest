package com.web.gmarket.common.config;



import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import com.web.gmarket.common.auth.filter.CustomAuthenticationFilter;
import com.web.gmarket.common.auth.handler.CustomAuthFailureHandler;
import com.web.gmarket.common.auth.handler.CustomAuthSuccessHandler;
import com.web.gmarket.common.auth.handler.CustomAuthenticationProvider;
import com.web.gmarket.common.auth.service.CustomSessionExpiredStrategy;
import com.web.gmarket.common.auth.service.impl.AccessDeniedHandlerImpl;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	/**
     * 1. 정적 자원(Resource)에 대해서 인증된 사용자가 정적 자원의 접근에 대해 ‘인가’에 대한 설정을 담당하는 메서드입니다.
     *
     * @return WebSecurityCustomizer
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // 정적 자원에 대해서 Security를 적용하지 않음으로 설정
        return web -> web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
    
    /**
     * 2. HTTP에 대해서 ‘인증’과 ‘인가’를 담당하는 메서드이며 필터를 통해 인증 방식과 인증 절차에 대해서 등록하며 설정을 담당하는 메서드입니다.
     *
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception Exception
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)                                       							// CSRF 보호 비활성화 운영일 경우 홣성화 ignoringRequestMatchers("/api/v1/**")
                .cors(AbstractHttpConfigurer::disable)																	// CORS 비홣성화
                .authorizeHttpRequests(auth ->
                	auth.requestMatchers("/**").permitAll()
//                	auth.requestMatchers("/login", "/css/**", "/js/**"
//                			, "/images/**", "/static/**", "/fonts/**").permitAll()
                		.requestMatchers("/view/hist").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/send").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/excelSend").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/fileSend").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/dbSend").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/bulkHist").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/wait").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/real").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN", "ROLE_USER")
                		.requestMatchers("/view/stat").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN")
                		.requestMatchers("/view/user").hasAnyAuthority("ROLE_SUPER", "ROLE_ADMIN")
                        .anyRequest().authenticated())
                		.exceptionHandling(exception -> exception
                				.accessDeniedHandler(accessDeniedHandler()) // 접근 거부 핸들러 설정
                		)
//                		.sessionManagement(session -> session
//            				.sessionFixation(sessionFixation -> sessionFixation
//            		                .migrateSession()
//            		        )
//                			.sessionFixation().migrateSession()															// 세션 고정 공격(Session Fixation Attack) 방지
//            		        .maximumSessions(1)																			// 세션 갯수 설정 최대 1명
//            		        .expiredSessionStrategy(new CustomSessionExpiredStrategy())									// Spring Security에서 세션이 만료되었을 때 사용자 정의 동작을 실행할 수 있도록 해주는 전략 클래스
//            		        .maxSessionsPreventsLogin(true)																// 기존 로그인 강제 종료, 새 로그인 허용
//            		        .sessionRegistry(sessionRegistry())
//            		    )
                .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)      		// 사용자 인증(커스텀 필터)
                .formLogin((formLogin) ->
                	formLogin
                        .loginPage("/login")
                        .usernameParameter("userId") 
                        .passwordParameter("userPwd") 
                        .loginProcessingUrl("/login-process")
                        .successHandler(customLoginSuccessHandler())
                        .failureHandler(customLoginFailureHandler())
                        .permitAll()																					// 추가를 안하면 로그인 페이지로 무한 리다이렉트가 발생
                 )
                .logout((logout) -> 
                	logout.logoutSuccessUrl("/login")
                		.logoutUrl("/logout")
                		.invalidateHttpSession(true)																// 세션 삭제
                )
                .build();
    }
    
    /**
     * 3. authenticate 의 인증 메서드를 제공하는 매니져로'Provider'의 인터페이스를 의미합니다.
     * - 과정: CustomAuthenticationFilter → AuthenticationManager(interface) → CustomAuthenticationProvider(implements)
     *
     * @return AuthenticationManager
     */
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(customAuthenticationProvider());
    }
    
    /**
     * 4. '인증' 제공자로 사용자의 이름과 비밀번호를 데이터베이스에 제공하여 반환받습니다.
     * - 과정: CustomAuthenticationFilter → AuthenticationManager(interface) → CustomAuthenticationProvider(implements)
     *
     * @return CustomAuthenticationProvider
     */
    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() {
        return new CustomAuthenticationProvider(bCryptPasswordEncoder());
    }
    
    /**
     * 5. 비밀번호를 암호화하기 위한 BCrypt 인코딩을 통하여 비밀번호에 대한 암호화를 수행합니다.
     *
     * @return BCryptPasswordEncoder
     */
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * 6. 커스텀을 수행한 '인증' 필터로 접근 URL, 데이터 전달방식(form) 등 인증 과정 및 인증 후 처리에 대한 설정을 구성하는 메서드입니다.
     *
     * @return CustomAuthenticationFilter
     */
    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter() {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManager());
        customAuthenticationFilter.setFilterProcessesUrl("/api/v1/login");     												// 접근 URL
        customAuthenticationFilter.setAuthenticationSuccessHandler(customLoginSuccessHandler());    						// '인증' 성공 시 해당 핸들러로 처리를 전가한다.
        customAuthenticationFilter.setAuthenticationFailureHandler(customLoginFailureHandler());    						// '인증' 실패 시 해당 핸들러로 처리를 전가한다.
        customAuthenticationFilter.afterPropertiesSet();
        return customAuthenticationFilter;
    }
    
    /**
     * 7. Spring Security 기반의 사용자의 정보가 '맞을 경우' 수행이 되며 결과값을 리턴해주는 Handler
     *
     * @return CustomLoginSuccessHandler
     */
    @Bean
    public CustomAuthSuccessHandler customLoginSuccessHandler() {
        return new CustomAuthSuccessHandler();
    }
    
    /**
     * 8. Spring Security 기반의 사용자의 정보가 '맞지 않을 경우' 수행이 되며 결과값을 리턴해주는 Handler
     *
     * @return CustomAuthFailureHandler
     */
    @Bean
    public CustomAuthFailureHandler customLoginFailureHandler() {
        return new CustomAuthFailureHandler();
    }
    
    /**
     * 9. Spring Security 기반의 사용자의 권한에 맞지 않는 페이지 이동 시 결곽밧을 리턴해주는 Handler
     *
     * @return accessDeniedHandler
     */
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
    	return new AccessDeniedHandlerImpl();
    }
    
    /**
     * 10. Spring Security 기반의 중복 로그인 방지를 위해 동시에 여러 세션이 열리지 않도록 함
     *
     * @return sessionRegistry
     */
    @Bean
	public SessionRegistry sessionRegistry() {
	    return new SessionRegistryImpl();
	}
	
    /**
     * 11. HttpSession 이벤트를 Spring 이벤트로 변환시킨다. 세션 생성 및 소멸 이벤트를 처리하는 데 도움이 됨
     *
     * @return ServletListenerRegistrationBean
     */
    @Bean
    public static HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}