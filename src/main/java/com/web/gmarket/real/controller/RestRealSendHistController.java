package com.web.gmarket.real.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.real.dto.RealDto;
import com.web.gmarket.real.dto.ServiceStatusFailoverDto;
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
	 * 옥션 및 G마켓 전체 현황
	 * 
	 * @param authentication
	 * @param code
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication,  @RequestParam(name="code", defaultValue = "1") int code) {
		
		try {
			
			// 0: 옥션, 1: G마켓
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
	 * @param authentication
	 * @param companyCode
	 * @param tableCode
	 * @return
	 */
	@ResponseBody
	@PostMapping("/tableList")
	public ResponseEntity<?> tableList(
			Authentication authentication,
			@RequestParam(name="companyCode", defaultValue = "0") int companyCode,
			@RequestParam(name="codeList") List<Integer> codeList) {
		
		try {
			
			return new ResponseEntity<>(realService.selectRealHistTableList(companyCode, codeList), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new RealDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	/**
	 * 프로세스 상태
	 * @param view
	 * @param tab
	 * @return
	 */
	@ResponseBody
	@PostMapping("/procStatusList")
	public ResponseEntity<?> procStatusList(
			Authentication authentication,
			@RequestParam(name="view", defaultValue = "summary") String view,
			@RequestParam(name="tab", defaultValue = "1") int tab) {
		
		try {
			
			return new ResponseEntity<>(realService.selectProcStatusList(view, tab), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new RealDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	/**
	 * 서버 상태 목록 조회
	 * 
	 * @return
	 */
	@GetMapping("/serverStatusList")
	public ResponseEntity<?> serverStatusList(
			Authentication authentication) {
		try {
			
			return new ResponseEntity<>(realService.selectServerStatusList(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new ServiceStatusFailoverDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}	
	}
	
	/**
	 * 수동 절체 FLAG 업데이트
	 * 
	 * @return
	 */
	@PutMapping("/flagUpdate")
	public ResponseEntity<Map<String, Object>> flagUpdate(
			Authentication authentication,
			@RequestBody ServiceStatusFailoverDto dto) {

		Map<String, Object> result = realService.updateServerFlag(dto);

		return ResponseEntity.ok(result);
	}

}