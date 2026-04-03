package com.web.gmarket.stat.controller;

import java.util.List;
import java.util.Comparator;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.service.StatService;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.dto.StatDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/stat")
public class RestStatController {

	@Autowired
	private StatService statService;
	@Autowired
	private CommonService commonService;

	public RestStatController(StatService statService, CommonService commonService) {
		this.statService = statService;
		this.commonService = commonService;
	}
	
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

	@PostMapping("/codeList")
	public List<Map<String, Object>> getCodeList() {
		
		// 테이블 명 목록 전체 조회
		List<Map<String, Object>> codeList = commonService.getStatCodeMapper().selectStatCodeList(-1, 0).stream()
				.sorted(Comparator.comparing(StatCodeDto::getCompanyCode).thenComparing(StatCodeDto::getTableCode))
			    .map(dto -> {
			        Map<String, Object> map = new HashMap<>();
			        map.put("companyCode", dto.getCompanyCode());
			        map.put("code", dto.getTableCode());
			        map.put("name", dto.getTableName());
			        return map;
			    })
			    .collect(Collectors.toList());
		
		return codeList;
	}
}