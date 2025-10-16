package com.web.gmarket.alarm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.alarm.dto.AlarmDto;
import com.web.gmarket.alarm.service.AlarmService;
import com.web.gmarket.common.service.CommonService;

@Service
public class AlarmServiceImpl implements AlarmService {
	
	@Autowired
	private CommonService commonService;

	@Override
	public int selectAlarmListCount(AlarmDto dto) {
		return commonService.getAlarmMapper().selectAlarmListCount(dto);
	}

	@Override
	public List<AlarmDto> selectAlarmList(AlarmDto dto) {
		return commonService.getAlarmMapper().selectAlarmList(dto);
	}

}
