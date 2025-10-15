package com.web.gmarket.alarm.service;

import java.util.List;

import com.web.gmarket.alarm.dto.AlarmDto;

public interface AlarmService {
	
	public int selectAlarmListCount();
	
	public List<AlarmDto> selectAlarmList();
}
