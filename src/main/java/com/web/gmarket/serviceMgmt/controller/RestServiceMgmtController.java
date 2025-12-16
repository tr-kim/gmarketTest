package com.web.gmarket.serviceMgmt.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.serviceMgmt.dto.ServiceMgmtDto;
import com.web.gmarket.serviceMgmt.service.ServiceMgmtService;
@RestController
@RequestMapping("/api/v1/service")
public class RestServiceMgmtController {
	
	private final ServiceMgmtService serviceMgmtService;

	public RestServiceMgmtController(ServiceMgmtService serviceMgmtService) {
		this.serviceMgmtService = serviceMgmtService;
	}

	@PostMapping("/list")
	public ResponseEntity<?> getCheckBitlist(@RequestBody ServiceMgmtDto serviceMgmtDto) {
		try {
			List<ServiceMgmtDto> result = serviceMgmtService.getServiceMgmtList(serviceMgmtDto);
			
			Map<String, Object> response = new HashMap<>();
			response.put("data", result);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
	        Map<String, Object> error = new HashMap<>();
	        error.put(ConstantsUtils.MESSAGE, "서비스 관리 조회 실패");
	        error.put(ConstantsUtils.ERROR, e.getMessage());
	        
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	// @PutMapping("/update")
	// public ResponseEntity<?> updateCheckBitlist(@RequestBody List<ServiceMgmtDto> list) {

	// 	serviceMgmtService.updateServiceCheckBit(list);

	// 	return ResponseEntity.ok(Map.of("message", "서비스 관리 수정 성공"));
	// }
}
