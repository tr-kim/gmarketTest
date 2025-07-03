package com.web.gmarket.bulk.hist.dto;

import lombok.Getter;
import lombok.Setter;

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
    private String title;

    //조회 컬럼
    private String bulkMsgKey;
	private String bulkLoginID;
	private String bulkUserID;
	private String bulkTitle;
	private String bulkMsg;
	private String bulkInTime;
	private String bulkReqTime;
	private String bulkCnt;
    private String bulkStatus;
    private String bulkSvcType;
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
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getBulkMsgKey() {
		return bulkMsgKey;
	}
	
	public void setBulkMsgKey(String bulkMsgKey) {
		this.bulkMsgKey = bulkMsgKey;
	}
	
	public String getBulkLoginID() {
		return bulkLoginID;
	}
	
	public void setBulkLoginID(String bulkLoginID) {
		this.bulkLoginID = bulkLoginID;
	}
	
	public String getBulkUserID() {
		return bulkUserID;
	}
	
	public void setBulkUserID(String bulkUserID) {
		this.bulkUserID = bulkUserID;
	}
	
	public String getBulkTitle() {
		return bulkTitle;
	}
	
	public void setBulkTitle(String bulkTitle) {
		this.bulkTitle = bulkTitle;
	}
	
	public String getBulkMsg() {
		return bulkMsg;
	}
	
	public void setBulkMsg(String bulkMsg) {
		this.bulkMsg = bulkMsg;
	}
	
	public String getBulkInTime() {
		return bulkInTime;
	}
	
	public void setBulkInTime(String bulkInTime) {
		this.bulkInTime = bulkInTime;
	}
	
	public String getBulkReqTime() {
		return bulkReqTime;
	}
	
	public void setBulkReqTime(String bulkReqTime) {
		this.bulkReqTime = bulkReqTime;
	}
	
	public String getBulkCnt() {
		return bulkCnt;
	}
	
	public void setBulkCnt(String bulkCnt) {
		this.bulkCnt = bulkCnt;
	}

    public String getBulkStatus() {
		return bulkStatus;
	}
	
	public void setBulkStatus(String bulkStatus) {
		this.bulkStatus = bulkStatus;
	}
	
	public String getBulkSvcType() {
		return bulkSvcType;
	}
	
	public void setBulkSvcType(String bulkSvcType) {
		this.bulkSvcType = bulkSvcType;
	}
	
	public String getBulkSeq() {
		return bulkSeq;
	}
	
	public void setBulkSeq(String bulkSeq) {
		this.bulkSeq = bulkSeq;
	}
}

   