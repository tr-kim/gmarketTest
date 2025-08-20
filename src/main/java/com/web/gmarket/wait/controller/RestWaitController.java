package com.web.gmarket.wait.controller;

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

import com.web.gmarket.wait.service.WaitService;
import com.web.gmarket.wait.dto.WaitDto;

@RestController
@RequestMapping("/api/v1/wait")
public class RestWaitController {
	
	private final WaitService waitService;
	
	public RestWaitController(WaitService waitService) {
		this.waitService = waitService;
	}
	
	@PostMapping("/list")
	public ResponseEntity<?> getWaitList(@RequestBody WaitDto waitDto) {
		try {
			
			List<WaitDto> result = waitService.getWaitList(waitDto);
			int totalCount = waitService.getWaitCount(waitDto);
			
			Map<String, Object> response = new HashMap<>();
			response.put("data", result);
			response.put("totalCount", totalCount);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
	        Map<String, Object> error = new HashMap<>();
	        error.put("message", "이력 조회 실패");
	        error.put("error", e.getMessage());
	        
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
	
	@PutMapping("/update")
	public void update() {
		
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteWaitList(@RequestBody List<WaitDto> waitDtoList) {
		return waitService.deleteWaitList(waitDtoList);
	}
	
}