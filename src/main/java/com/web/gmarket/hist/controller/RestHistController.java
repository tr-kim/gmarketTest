package com.web.gmarket.hist.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
			return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("이력 조회 실패: " + e.getMessage());
		}
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
}