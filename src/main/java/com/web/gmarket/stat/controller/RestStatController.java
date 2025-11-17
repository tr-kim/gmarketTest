package com.web.gmarket.stat.controller;

import java.util.Collections;
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

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.service.StatService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/stat")
public class RestStatController {

	@Autowired
	private StatService statService;
	
	/**
	 * 정산 / 통계 조회
	 * 
	 * @param authentication
	 * @param statDto
	 * @param statCodeDto
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication, @RequestBody StatDto statDto) {
		Map<String, Object> result = new HashMap<>();
		
		try {
			
			result.put(ConstantsUtils.LIST, statService.selectStatList(statDto));
			result.put(ConstantsUtils.TOTAL_COUNT, statService.selectStatListCount(statDto));

			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			
			result.put(ConstantsUtils.LIST, Collections.emptyList());
			result.put(ConstantsUtils.TOTAL_COUNT, 0);
	
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}

	}
}