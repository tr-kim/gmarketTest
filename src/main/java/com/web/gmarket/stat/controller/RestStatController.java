package com.web.gmarket.stat.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.service.StatService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/stat")
public class RestStatController {

	@Autowired
	private StatService statService;
	
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication, StatDto statDto) {
		List<StatDto> list = new ArrayList<>();

		try {
			
			LocalDateTime dateTime1 = LocalDateTime.parse(statDto.getStartDate().split(",")[0]);
			statDto.setStartDate(dateTime1.format(DateTimeFormatter.ofPattern("yyyyMMddHH")));
			
			LocalDateTime dateTime2 = LocalDateTime.parse(statDto.getEndDate().split(",")[0]);
			statDto.setEndDate(dateTime2.format(DateTimeFormatter.ofPattern("yyyyMMddHH")));
			
			list = statService.selectStatListAuction(statDto);

			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(list);
		}

	}

	@PutMapping("/update")
	public void update() {
	}

	@DeleteMapping("/delete")
	public void delete() {
	}
}