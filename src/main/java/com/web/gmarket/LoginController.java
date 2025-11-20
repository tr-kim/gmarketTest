package com.web.gmarket;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.LoginErrorHelper;
import com.web.gmarket.common.utils.RsaUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class LoginController {
	
	private final LoginErrorHelper loginErrorHelper;

	@GetMapping("/login")
	public String login(HttpServletRequest request, HttpServletResponse response, Authentication authentication,
			HttpSession session, Model model) {

		// 이미 로그인된 사용자면 /index 으로 리다이렉트
		if (authentication != null && authentication.isAuthenticated()) {
			return "redirect:/index";
		}

		try {
			
			// 로그인 시 에러 체크
			loginErrorHelper.loginErrorChk(session, model);

			// Private Key 삭제
			request.getSession().removeAttribute(ConstantsUtils.RSA_WEB_KEY);

			// PrivateKey, PublicKey 생성
			KeyPair keyPair = RsaUtil.generateKeypair();
		
			RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
			RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
	
			// PrivateKey Session 저장
			session.setAttribute(ConstantsUtils.RSA_WEB_KEY, privateKey);
	
			// PublicKey input hidden 저장
			model.addAttribute(ConstantsUtils.RSA_MODULUS, RsaUtil.getRSAPublicModulus(publicKey));
			model.addAttribute(ConstantsUtils.RSA_EXPONENT, RsaUtil.getRSAPublicExponent(publicKey));
		
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
		}

		return "login";
	}

	@GetMapping("/login1")
	public String login1() {
		return "login1";
	}

	@GetMapping("/login2")
	public String login2() {
		return "login2";
	}

	@GetMapping("/login3")
	public String login3() {
		return "login3";
	}
}