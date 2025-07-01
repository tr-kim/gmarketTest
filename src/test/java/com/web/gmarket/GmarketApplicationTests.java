package com.web.gmarket;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.web.gmarket.common.utils.RsaUtil;

@ExtendWith(MockitoExtension.class)
class GmarketApplicationTests {
	
//	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	PasswordEncoder encoder = new BCryptPasswordEncoder();
	
	private static final String RSA_ALGORITHM = "RSA";
    private static final int RSA_KEY_SIZE = 2048;

	@Test
	void contextLoads() {
		
		String password = "dinnovan1234";

		String encodedPassword = encoder.encode(password);
		System.out.println(encodedPassword);
		
	}
	
	
	@Test
	void rsaTest() throws Exception {
		
		String password = "dinnovan1234";

		KeyPair keyPair = this.generateKeyPair();
		String rsaEncrypted = this.encrypt(password, keyPair.getPublic());
        String rsaDecrypted = this.decrypt(rsaEncrypted, keyPair.getPrivate());
        System.out.println("RSA Encrypted: " + rsaEncrypted);
        System.out.println("RSA Decrypted: " + rsaDecrypted);
		
	}
	
	 /**
     * RSA 키 쌍 생성
     */
    public KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyGen.initialize(RSA_KEY_SIZE);
        return keyGen.generateKeyPair();
    }

    /**
     * 주어진 데이터를 RSA 알고리즘으로 암호화
     */
    public String encrypt(String data, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        System.out.println("RSA encryptedBytes: " + encryptedBytes.length);
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    /**
     * 주어진 암호화된 데이터를 RSA 알고리즘으로 복호화
     */
    public String decrypt(String encryptedData, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes);
    }

    /**
     * Base64 인코딩된 문자열에서 공개 키를 생성
     */
    public PublicKey getPublicKey(String base64PublicKey) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        return keyFactory.generatePublic(spec);
    }

    /**
     * Base64 인코딩된 문자열에서 개인 키를 생성
     */
    public PrivateKey getPrivateKey(String base64PrivateKey) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        return keyFactory.generatePrivate(spec);
    }

}
