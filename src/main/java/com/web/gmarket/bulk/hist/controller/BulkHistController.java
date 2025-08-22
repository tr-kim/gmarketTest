package com.web.gmarket.bulk.hist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class BulkHistController {
	
	@GetMapping("/bulkHist")
	public String bulkHist(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.BULK_HIST);
		
		return "view/bulk/bulk_hist";
	}
	
	@GetMapping("/bulkHist/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.BULK_HIST);
		
		return "view/bulk/bulk_hist";
	}
}