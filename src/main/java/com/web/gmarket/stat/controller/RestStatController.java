package com.web.gmarket.stat.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stat")
public class RestStatController {
	
	@PostMapping("/list")
	public void list() {
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
}