package com.web.gmarket.bulk.hist.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BulkHistDto {
	//조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String bulkTitle;
	private List<String> monthTables;
	private Integer skip;
	private Integer take;
	
	//조회 컬럼
	private String bulkMsgKey;
	private String loginID;
	private String userID;
	private String title;
	private String msg;
	private String inTime;
	private String reqTime;
	private String cnt;
	private String status;
	private String svcType;
	private String bulkSeq;
	private String succCnt;
	private String failCnt;
	private Integer cntStanby;
	private Integer cntTran;
	private Integer cntSucc;
	private Integer cntDup;
	private Integer cntSendFail;
	
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
	
	public String getBulkTitle() {
		return bulkTitle;
	}
	
	public void setBulkTitle(String bulkTitle) {
		this.bulkTitle = bulkTitle;
	}
	
	public List<String> getMonthTables() {
		return monthTables;
	}
	
	public void setMonthTables(List<String> monthTables) {
		this.monthTables = monthTables;
	}
	
	public String getBulkMsgKey() {
		return bulkMsgKey;
	}
	
	public void setBulkMsgKey(String bulkMsgKey) {
		this.bulkMsgKey = bulkMsgKey;
	}
	
	public String getLoginID() {
		return loginID;
	}
	
	public void setLoginID(String loginID) {
		this.loginID = loginID;
	}
	
	public String getUserID() {
		return userID;
	}
	
	public void setUserID(String userID) {
		this.userID = userID;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getMsg() {
		return msg;
	}
	
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	public String getInTime() {
		return inTime;
	}
	
	public void setInTime(String inTime) {
		this.inTime = inTime;
	}
	
	public String getReqTime() {
		return reqTime;
	}
	
	public void setReqTime(String reqTime) {
		this.reqTime = reqTime;
	}
	
	public String getCnt() {
		return cnt;
	}
	
	public void setCnt(String cnt) {
		this.cnt = cnt;
	}

    public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getSvcType() {
		return svcType;
	}
	
	public void setSvcType(String svcType) {
		this.svcType = svcType;
	}
	
	public String getBulkSeq() {
		return bulkSeq;
	}
	
	public void setBulkSeq(String bulkSeq) {
		this.bulkSeq = bulkSeq;
	}
	
	public String getSuccCnt() {
		return succCnt;
	}
	
	public void setSuccCnt(String succCnt) {
		this.succCnt = succCnt;
	}
	
	public String getFailCnt() {
		return failCnt;
	}
	
	public void setFailCnt(String failCnt) {
		this.failCnt = failCnt;
	}

	public Integer getCntStanby() {
		return cntStanby;
	}
	
	public void setCntStanby(Integer cntStanby) {
		this.cntStanby = cntStanby;
	}
	
	public Integer getCntTran() {
		return cntTran;
	}
	
	public void setCntTran(Integer cntTran) {
		this.cntTran = cntTran;
	}
	
	public Integer getCntSucc() {
		return cntSucc;
	}
	
	public void setCntSucc(Integer cntSucc) {
		this.cntSucc = cntSucc;
	}
	
	public Integer getCntDup() {
		return cntDup;
	}
	
	public void setCntDup(Integer cntDup) {
		this.cntDup = cntDup;
	}
	
	public Integer getCntSendFail() {
		return cntSendFail;
	}
	
	public void setCntSendFail(Integer cntSendFail) {
		this.cntSendFail = cntSendFail;
	}
}

   