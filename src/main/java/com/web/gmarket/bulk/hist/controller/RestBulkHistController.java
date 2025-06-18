package com.web.gmarket.bulk.hist.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bulkHist")
public class RestBulkHistController {
	
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