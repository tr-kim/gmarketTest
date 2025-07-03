package com.web.gmarket.bulk.hist.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;
import com.web.gmarket.bulk.hist.service.BulkHistService;

@RestController
@RequestMapping("/api/v1/bulkHist")
public class RestBulkHistController {

	private final BulkHistService bulkHistService;
	
	public RestBulkHistController(BulkHistService bulkHistService) {
		this.bulkHistService = bulkHistService;
	}
	
	@PostMapping("/list")
	public ResponseEntity<?> getHistList(@RequestBody BulkHistDto bulkHistDto) {
		try {
			List<BulkHistDto> result = bulkHistService.getHistList(bulkHistDto);
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