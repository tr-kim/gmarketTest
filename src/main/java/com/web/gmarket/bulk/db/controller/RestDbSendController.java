package com.web.gmarket.bulk.db.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.service.DbSendService;

@RestController
@RequestMapping("/api/v1/dbSend")
public class RestDbSendController {
	
	private final DbSendService dbSendService;
	
	public RestDbSendController(DbSendService dbSendService) {
		this.dbSendService = dbSendService;
	}

	@PostMapping("/list")
	public void list() {
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}

	//요청조회
	@PostMapping("/search")
	public ResponseEntity<?> getDbSendList(@RequestBody DbSendDto dbSendDto) {
		try {
			List<DbSendDto> result = dbSendService.getDbSendList(dbSendDto);
			int totalCount = dbSendService.getDbSendCount(dbSendDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put("data", result);
	        response.put("totalCount", totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
	        error.put("message", "요청번호 조회 실패");
	        error.put("error", e.getMessage());
	        
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
}