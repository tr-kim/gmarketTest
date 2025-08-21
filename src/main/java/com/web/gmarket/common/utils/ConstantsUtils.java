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
	public static final String TOTAL_COUNT = "totalCount";
	public static final String GMAREKT = "gmarket";
	public static final String AUCTION = "auction";
	public static final String SHA_512 = "SHA-512";
	public static final String EUC_KR = "EUC-KR";
	public static final String LAYOUT = "layout";
	public static final String ACTIVE = "active";
	
	public static final String TABLE_NAME = "tableName";
	public static final String BULK_MSG_KEY = "bulkMsgKey";
	public static final String CNT_STANBY = "cntStanby";
	public static final String CNT_TRAN = "cntTran";
	public static final String CNT_SUCC = "cntSucc";
	public static final String CNT_DUP = "cntDup";
	public static final String CNT_SEND_FAIL = "cntSendFail";
	
	// Page Type
	public static final String STAT = "stat";
	public static final String WAIT = "wait";
	public static final String USER = "user";
	public static final String EXCEL_SEND = "excelSend";
	public static final String SEND = "send";
	public static final String REAL = "real";
	public static final String HIST = "hist";
	public static final String BULK_HIST = "bulkHist";
	public static final String FILE_SEND = "fileSend";
	public static final String DB_SEND = "dbSend";
	
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
	
	// DB Connection Type
	public static final String DB_GMAREKT = "gmarket";
	public static final String DB_AUCTION = "auction";
	
	// Company Code
	public static final int AUCTION_CODE = 0;
	public static final int GMAREKT_CODE = 1;
	
	// SVC_TYPE_TABLE
	public static final String EXCEL_SMS = "EXCEL_SMS";
	public static final String EXCEL_LMS = "EXCEL_LMS";
	public static final String EXCEL_MMS = "EXCEL_MMS";
	public static final String FILE_SMS = "FILE_SMS";
	public static final String FILE_LMS = "FILE_LMS";
	public static final String FILE_MMS = "FILE_MMS";
	public static final String DB_SMS = "DB_SMS";
	public static final String DB_LMS = "DB_LMS";
	public static final String DB_MMS = "DB_MMS";
	public static final String SINGLE_SMS = "SINGLE_SMS";
	public static final String SINGLE_LMS = "SINGLE_LMS";
	public static final String SINGLE_MMS = "SINGLE_MMS";
	
	public static final String SMSCLI_TBL_EVENT = "SMSCLI_TBL_EVENT";
	public static final String LMSCLI_TBL_EVENT = "LMSCLI_TBL_EVENT";
	public static final String MMSCLI_TBL_EVENT = "MMSCLI_TBL_EVENT";
	public static final String SMSCLI_TBL_LARGE = "SMSCLI_TBL_LARGE";
	public static final String LMSCLI_TBL_LARGE = "LMSCLI_TBL_LARGE";
	public static final String MMSCLI_TBL_LARGE = "MMSCLI_TBL_LARGE";
	
}
