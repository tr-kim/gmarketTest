package com.web.gmarket.real.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.service.RealService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/real")
public class RestRealSendHistController {
	
	@Autowired
	private RealService realService;
	
	/**
	 * 전체 현황
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/totalList")
	public ResponseEntity<?> totalList() {
		try {
			
			return new ResponseEntity<>(realService.selectRealHistTotalList(ConstantsUtils.TOTAL_MON_TIME, ConstantsUtils.ALARM_FLAG), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new ArrayList<RealDto>(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
	}
	

	/**
	 * 옥션 및 지마켓 전체 현황
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication,  @RequestParam(name = "code", defaultValue = "1") int code) {
		
		try {
			
			// 0이면 옥션, 1이면 지마켓
			return new ResponseEntity<>(realService.selectRealHistList(code), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new RealDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
	}
	
	/**
	 * 테이블별 현황
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/tableList")
	public ResponseEntity<?> tableList(Authentication authentication,  @RequestParam(name = "code", defaultValue = "11") int code) {
		RealDto dto = new RealDto();
		
		try {
			// 테이블별 코드
			return new ResponseEntity<>(realService.selectRealHistTableList(code), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new RealDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}