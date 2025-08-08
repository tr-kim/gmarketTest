package com.web.gmarket.common.utils;

public class ConstantsUtils {
	private ConstantsUtils() {} // 인스턴스화 방지
	
	public static final String FALG_T = "T";
	public static final String FALG_F = "F";
	public static final String FALG_Y = "Y";
	public static final String FALG_N = "N";
	
	public static final String SUCCESS = "success";
	public static final String FAILD = "faild";
	
	public static final int SUCCESS_CODE = 1000;
	public static final int ERROR_CODE = 9999;
	public static final int VALIDATE_ERROR = 9001;
	public static final int USER_DUPLICATION = 9002;	// 사용자 중복
	public static final int USER_NON_EXISTENCE = 9003;	// 사용자 미존재
	public static final int DATA_DOSE_NOT_EXIST = 9004; // 누락된 데이터
	
	public static final String CODE = "code";
	public static final String LIST = "list";
	public static final String JSON = "json";
	public static final String STATUS = "status";
	public static final String MESSAGE = "message";
	public static final String REASON = "reason";
	public static final String RESULT = "result";
	
	public static final String APPLICATION_JSON = "application/json";
	public static final String AUTHORIZATION = "Authorization";
	
	// User Role
	public static final String ROLE_SUPER = "ROLE_SUPER";
	public static final String ROLE_ADMIN = "ROLE_ADMIN";
	public static final String ROLE_USER = "ROLE_USER";
	public static final String ROLE_OPERATOR = "ROLE_OPERATOR";
	public static final String ROLE_COMMON = "ROLE_COMMON";
	
	// Login Error
	public static final String DUPLICATE_LOGIN = "DUPLICATE_LOGIN";
	public static final String PASSWORD_NOT_MATCH = "PASSWORD_NOT_MATCH";
	public static final String NOT_USE = "NOT_USE";
	public static final String NOT_USER = "NOT_USER";
	public static final String USER_ID_EMPTY = "USER_ID_EMPTY";
	public static final String USER_INFO_INCORRECT = "USER_INFO_INCORRECT";
	public static final String USER_FAILD = "USER_FAILD";
	
	// RSA
	public static final String RSA_WEB_KEY = "_RSA_WEB_Key_";
	public static final String PUBLIC_KEY = "PUBLIC_KEY";
	public static final String INTANCE_TYPE_RSA = "RSA";
	public static final String RSA_MODULUS = "RSA_MODULUS";
	public static final String RSA_EXPONENT = "RSA_EXPONENT";
	
	// Real Send Hist
	public static final int TOTAL_MON_TIME = 1; // ex) 5분 => 5
	public static final int ALARM_FLAG = 2; // 알람에 대한 데이터를 가져오는 기준 => 1 -> 현재시간부터 (현재시간 - TOTAL_MON_TIME(분)) 까지의 데이터, 2 -> 최근전송시간부터 (최근전송시간 - TOTAL_MON_TIME(분)) 까지의 데이터
	public static final int TOTAL_GRAPH_TIME = 60; // Graph Reload 시간 간격(초단위, ex) 1분 => 60)
}
