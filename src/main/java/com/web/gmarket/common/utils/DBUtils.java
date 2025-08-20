package com.web.gmarket.common.utils;

public class DBUtils {
	
	// 대분류에 따른 DB 이름 변경
	public static String getDBName(int code) {

		switch (code) {
			case ConstantsUtils.AUCTION_CODE:
				return ConstantsUtils.DB_AUCTION;
			case ConstantsUtils.GMAREKT_CODE:
				return ConstantsUtils.DB_GMAREKT;
			default:
				return ConstantsUtils.DB_AUCTION;
		}
	}
}
