package com.web.gmarket.real.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
		RealDto dto = new RealDto();
		
		try {
			
			dto = realService.selectRealHistTotalList(ConstantsUtils.TOTAL_MON_TIME, ConstantsUtils.ALARM_FLAG);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
		}
		
		return new ResponseEntity<>(dto, HttpStatus.OK);
	}
	

	/**
	 * 옥션 및 지마켓 전체 현황
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication, @RequestBody int companyCode) {
		RealDto dto = new RealDto();
		
		try {
			
			// 0이면 옥션, 1이면 지마켓
			dto = realService.selectRealHistList(companyCode);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
		}
		
		return new ResponseEntity<>(dto, HttpStatus.OK);
	}
	
	/**
	 * 테이블별 현황
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/tableList")
	public ResponseEntity<?> tableList(Authentication authentication, @RequestBody int tableCode) {
		RealDto dto = new RealDto();
		
		try {
			
			dto = realService.selectRealHistTableList(tableCode);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
		}
		
		return new ResponseEntity<>(dto, HttpStatus.OK);
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
}