package com.web.gmarket.alarm.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.alarm.dto.AlarmDto;
import com.web.gmarket.alarm.service.AlarmService;
import com.web.gmarket.common.utils.ConstantsUtils;

@RestController
@RequestMapping("/api/v1/alarm")
public class RestAlarmController {
	
	@Autowired
	private AlarmService alarmService;

	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> getAlarmList(Authentication authentication, @RequestBody AlarmDto alarmDto) {
		
		 Map<String, Object> result = new HashMap<>();

		try {
			
	        result.put(ConstantsUtils.LIST, alarmService.selectAlarmList(alarmDto));
	        result.put(ConstantsUtils.TOTAL_COUNT, alarmService.selectAlarmListCount(alarmDto));
	        
			return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			
	        result.put(ConstantsUtils.MESSAGE, "알림 이력 조회 실패");
	        result.put(ConstantsUtils.ERROR, e.getMessage());
	        
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
}