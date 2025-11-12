package com.web.gmarket.hist.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.service.HistService;

@RestController
@RequestMapping("/api/v1/hist")
public class RestHistController {
	
	private final HistService histService;
	
	public RestHistController(HistService histService) {
		this.histService = histService;
	}
	
	@PostMapping("/list")
	public ResponseEntity<?> getHistList(@RequestBody HistDto histDto) {
		try {
			List<HistDto> result = histService.getHistList(histDto);
			int totalCount = histService.getHistCount(histDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put(ConstantsUtils.DATA, result);
	        response.put(ConstantsUtils.TOTAL_COUNT, totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
	        Map<String, Object> error = new HashMap<>();
	        error.put(ConstantsUtils.MESSAGE, "이력 조회 실패");
	        error.put(ConstantsUtils.ERROR, e.getMessage());
	        
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
}