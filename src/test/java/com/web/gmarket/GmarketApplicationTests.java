package com.web.gmarket;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class GmarketApplicationTests {
	
	PasswordEncoder encoder = new BCryptPasswordEncoder();

	@Test
	void contextLoads() {
		
		String password = "dinnovan1234";

		String encodedPassword = encoder.encode(password);
		System.out.println(encodedPassword);
		
	}

}
