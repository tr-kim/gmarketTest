package com.web.gmarket.bulk.excel.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/view")
public class ExcelSendController {
	
	@GetMapping("/excelSend")
	public String excelSend(Model model) {
		
		model.addAttribute("layout", "/layouts/top_layout");
		model.addAttribute("active", "excelSend");
		
		return "view/bulk/excel_send";
	}
	
	@GetMapping("/excelSend/left")
	public String left(Model model) {
		
		model.addAttribute("layout", "/layouts/left_layout");
		model.addAttribute("active", "excelSend");
		
		return "view/bulk/excel_send";
	}
}