package com.web.gmarket.alarm.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.alarm.dto.AlarmDto;

@Mapper
public interface AlarmMapper {

	public int selectAlarmListCount();
	
	public List<AlarmDto> selectAlarmList();
}
