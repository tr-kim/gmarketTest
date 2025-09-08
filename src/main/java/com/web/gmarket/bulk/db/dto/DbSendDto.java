package com.web.gmarket.bulk.db.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
// @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DbSendDto {
	// 조회 조건
	private Integer companyCode;
	private String messageType;
	private String tableName;
	
	// 조회 컬럼
	private String reserved4;
	private String tranPr;
	private String cnt;
	private String resultTable;
	
	public Integer getCompanyCode() {
		return companyCode;
	}
	
	public void setCompanyCode(Integer companyCode) {
		this.companyCode = companyCode;
	}
	
	public String getMessageType() {
		return messageType;
	}
	
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}
	
	public String getTableName() {
		return tableName;
	}
	
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	public String getReserved4() {
		return reserved4;
	}
	
	public void setReserved4(String reserved4) {
		this.reserved4 = reserved4;
	}
	
	public String getTranPr() {
		return tranPr;
	}
	
	public void setTranPr(String tranPr) {
		this.tranPr = tranPr;
	}
	
	public String getCnt() {
		return cnt;
	}
	
	public void setCnt(String cnt) {
		this.cnt = cnt;
	}
	
	public String getResultTable() {
		return resultTable;
	}
	
	public void setResultTable(String resultTable) {
		this.resultTable = resultTable;
	}
}
