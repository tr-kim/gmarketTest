package com.web.gmarket.common.utils;

public enum UserRole {
	SUPER(ConstantsUtils.ROLE_SUPER), 			// 슈터관리자 등급
	ADMIN(ConstantsUtils.ROLE_ADMIN),			// 관리자 등급
    USER(ConstantsUtils.ROLE_USER),				// 사용자 등급
    OPERATOR(ConstantsUtils.ROLE_OPERATOR),		// 운영자 등급
    COMMON(ConstantsUtils.ROLE_COMMON);			// 일반 등급
    
    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}