package com.web.gmarket.common.utils;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;

import org.springframework.stereotype.Component;

@Component
public class RsaUtil {

	// RSA 2048 Bit로 생성
	public static KeyPair generateKeypair() throws NoSuchAlgorithmException {

		KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(ConstantsUtils.INTANCE_TYPE_RSA);
		keyPairGen.initialize(2048);

		return keyPairGen.generateKeyPair();
	}
	
	public static String getRSAPublicModulus(RSAPublicKey publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		KeyFactory keyFactory = KeyFactory.getInstance(ConstantsUtils.INTANCE_TYPE_RSA);
		RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
		
		return publicSpec.getModulus().toString(16);
	}
	
	public static String getRSAPublicExponent(RSAPublicKey publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		KeyFactory keyFactory = KeyFactory.getInstance(ConstantsUtils.INTANCE_TYPE_RSA);
		RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
		
		return publicSpec.getPublicExponent().toString(16);
	}
	
	public static RSAPublicKeySpec getRSAPrivateKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
		return (RSAPublicKeySpec) generateKeypair().getPrivate();
	}
	
	/**
	 * RSA 복호화
	 * 
	 * @param privateKey
	 * @param securedValue
	 * @return
	 * @throws Exception 
	 */
	public static String decryptRsa(RSAPrivateKey privateKey, String securedValue) throws Exception {
		String decryptedValue = "";

		try {

			/**
			 * 암호화 된 값은 byte 배열이다. 
			 * 이를 문자열 폼으로 전송하기 위해 16진 문자열(hex)로 변경한다. 
			 * 서버측에서도 값을 받을 때 hex 문자열을 받아서 이를 다시 byte 배열로 바꾼 뒤에 복호화 과정을 수행한다.
			 */
			Cipher cipher = Cipher.getInstance(ConstantsUtils.INTANCE_TYPE_RSA);
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			byte[] decoded = Base64.getDecoder().decode(URLDecoder.decode(securedValue, StandardCharsets.UTF_8.name()));
			decryptedValue = new String(cipher.doFinal(decoded), StandardCharsets.UTF_8);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return decryptedValue;
	}
	
	/**
	 * 16진수 문자열 => byte 변환
	 * 
	 * @param hex
	 * @return
	 */
	public static byte[] hexToByteArray(String hex) {
		if(hex == null || hex.length() % 2 != 0) {
			return new byte[] {};
		}
		
		byte[] bytes = new byte[hex.length() / 2];
		for(int i = 0; i < hex.length(); i += 2) {
			byte value = (byte)Integer.parseInt(hex.substring(i, i + 2), 16);
			bytes[(int) Math.floor(i / 2)] = value;
		}
		
		return bytes;
	}

}
