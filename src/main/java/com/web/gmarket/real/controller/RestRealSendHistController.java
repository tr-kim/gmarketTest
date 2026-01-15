package com.web.gmarket.real.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.web.gmarket.real.dto.SummaryProcCountDto;
import com.web.gmarket.real.dto.SummaryProcNameDto;
import com.web.gmarket.real.dto.TrafficDetailDto;
import com.web.gmarket.real.dto.TrafficSummaryDto;
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
	 * 테이블별 현황 - 발송량 통계, 발송량 상세
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
	@ResponseBody
	@PostMapping("/serverStatusList")
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
	@ResponseBody
	@PutMapping("/flagUpdate")
	public ResponseEntity<Map<String, Object>> flagUpdate(
			Authentication authentication,
			@RequestBody ServiceStatusFailoverDto dto) {

		Map<String, Object> result = realService.updateServerFlag(dto);

		return ResponseEntity.ok(result);
	}

	/**
	 * 서비스 상태별 카운트 조회
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/summaryProcCount")
	public ResponseEntity<?> summaryProcCount(
			Authentication authentication) {
		try {
			
			return new ResponseEntity<>(realService.selectSummaryProcCount(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new SummaryProcCountDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * 서비스 상태별 서비스명 조회
	 * @param status: NORMAL: 정상, DOWN: 다운, ISSUE: 이슈, DELAY: 지연
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/summaryProcName")
	public ResponseEntity<?> summaryProcName(
			Authentication authentication,
			@RequestBody SummaryProcNameDto dto) {
		try {
			
			return new ResponseEntity<>(realService.selectSummaryProcName(dto.getStatus()), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());
			
			return new ResponseEntity<>(new SummaryProcNameDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 총 발송량 조회
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/trafficSummary")
	public ResponseEntity<?> trafficSummary(
		Authentication authentication) {
		try {

			return new ResponseEntity<>(realService.selectTrafficSummary(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());

			return new ResponseEntity<>(new TrafficSummaryDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 발송량 상세 조회
	 * 
	 * @return
	 */
	@ResponseBody
	@PostMapping("/trafficDetail")
	public ResponseEntity<?> trafficDetail(
		Authentication authentication) {
		try {

			return new ResponseEntity<>(realService.selectTrafficDetail(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getLocalizedMessage());

			return new ResponseEntity<>(new TrafficDetailDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}