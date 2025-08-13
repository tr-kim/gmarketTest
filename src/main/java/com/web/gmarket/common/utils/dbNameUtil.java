package com.web.gmarket.common.utils;

public class dbNameUtil {
	
	public static String getTableName(int code) {

		switch (code) {
		case 0:
			return ConstantsUtils.DB_AUCTION;
		case 1:
			return ConstantsUtils.DB_GMAREKT;
		default:
			return ConstantsUtils.DB_AUCTION;
		}
	}
}
