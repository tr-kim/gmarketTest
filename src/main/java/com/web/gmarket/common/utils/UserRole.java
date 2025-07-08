package com.web.gmarket.common.utils;

public enum UserRole {
	SUPER(0, ConstantsUtils.ROLE_SUPER), 			// 슈퍼관리자 등급
	ADMIN(1, ConstantsUtils.ROLE_ADMIN),			// 관리자 등급
    USER(2, ConstantsUtils.ROLE_USER),				// 사용자 등급
    OPERATOR(3, ConstantsUtils.ROLE_OPERATOR),		// 운영자 등급
    COMMON(4, ConstantsUtils.ROLE_COMMON);			// 일반 등급
    
    private final String value;
	private final int code;

    UserRole(int code, String value) {
        this.value = value;
        this.code = code;
    }

    public String getValue() {
        return value;
    }
    
    public int getCode() {
        return code;
    }
}