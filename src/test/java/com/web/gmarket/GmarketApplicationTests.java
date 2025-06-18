package com.web.gmarket;

import java.util.Base64;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import io.jsonwebtoken.security.Keys;

@WebMvcTest
class GmarketApplicationTests {

	@Test
	void contextLoads() {
		
		SecretKey secretKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        String base64Key = Base64.getEncoder().encodeToString(secretKey.getEncoded());

        System.out.println("랜덤 JWT Secret Key: " + base64Key);
	}

}
