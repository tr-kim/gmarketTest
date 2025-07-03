package com.web.gmarket.hist.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistDto {
	// 조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String phoneNum;
	private List<String> monthTables;
	private String tableName;
	
	// 조회 컬럼
	private String tranPr;
	private String tranPhone;
	private String tranCallback;
	private String tranStatus;
	private String tranDate;
	private String tranRslt;
	private String tranMsg;
	private String corpReserved2;
	
	public String getStartDate() {
		return startDate;
	}
	
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	
	public String getEndDate() {
		return endDate;
	}
	
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	
	public String getStartTime() {
		return startTime;
	}
	
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	
	public String getEndTime() {
		return endTime;
	}
	
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
	public String getPhoneNum() {
		return phoneNum;
	}
	
	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}
	
	public List<String> getMonthTables() {
		return monthTables;
	}
	
	public void setMonthTables(List<String> monthTables) {
		this.monthTables = monthTables;
	}
	
	public String getTableName() {
		return tableName;
	}
	
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	public String getTranPr() {
		return tranPr;
	}
	
	public void setTranPr(String tranPr) {
		this.tranPr = tranPr;
	}
	
	public String getTranPhone() {
		return tranPhone;
	}
	
	public void setTranPhone(String tranPhone) {
		this.tranPhone = tranPhone;
	}
	
	public String getTranCallback() {
		return tranCallback;
	}
	
	public void setTranCallback(String tranCallback) {
		this.tranCallback = tranCallback;
	}
	
	public String getTranStatus() {
		return tranStatus;
	}
	
	public void setTranStatus(String tranStatus) {
		this.tranStatus = tranStatus;
	}
	
	public String getTranDate() {
		return tranDate;
	}
	
	public void setTranDate(String tranDate) {
		this.tranDate = tranDate;
	}
	
	public String getTranRslt() {
		return tranRslt;
	}
	
	public void setTranRslt(String tranRslt) {
		this.tranRslt = tranRslt;
	}
	
	public String getTranMsg() {
		return tranMsg;
	}
	
	public void setTranMsg(String tranMsg) {
		this.tranMsg = tranMsg;
	}
	
	public String getCorpReserved2() {
		return corpReserved2;
	}
	
	public void setCorpReserved2(String corpReserved2) {
		this.corpReserved2 = corpReserved2;
	}
}