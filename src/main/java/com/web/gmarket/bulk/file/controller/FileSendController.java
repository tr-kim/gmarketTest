package com.web.gmarket.bulk.file.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.utils.ConstantsUtils;

@Controller
@RequestMapping("/view")
public class FileSendController {
	
	@GetMapping("/fileSend")
	public String fileSend(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.FILE_SEND);
		
		return "view/bulk/file_send";
	}
	
	@GetMapping("/fileSend/left")
	public String left(Model model) {
		
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.FILE_SEND);
		
		return "view/bulk/file_send";
	}
}