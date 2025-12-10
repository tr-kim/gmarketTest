package com.web.gmarket.serviceMgmt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/service")
public class RestServiceMgmtController {

	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication) {
		return null;
		

	}
}