package com.web.gmarket.wait.dto;

import lombok.Getter;
import lombok.Setter;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WaitDto {
    //조회 조건
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
    private String waitTitle;
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
	
	public String getWaitTitle() {
		return waitTitle;
	}
	
	public void setWaitTitle(String waitTitle) {
		this.waitTitle = waitTitle;
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
	
}
