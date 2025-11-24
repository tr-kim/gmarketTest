package com.web.gmarket;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.UserRole;
import com.web.gmarket.user.dto.UserDto;

@Controller
public class IndexController {
	
	@GetMapping("/")
	public String redirectToIndex() {
		return "redirect:/view/hist";
	}
	
	@GetMapping("/index")
	public String index(Authentication authentication, Model model) {
		
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		
//		model.addAttribute("layout", "/layouts/top_layout");
		// 운영자일 경우 실시간 발송 현황으로 이동
		return user.getUserGrade() == UserRole.OPERATOR.getCode() ? "redirect:/view/real" : "redirect:/view/hist";
	}
	
	@GetMapping("/index/left")
	public String left(Authentication authentication, Model model) {
		
		UserDto user = (UserDto) authentication.getPrincipal();
		
//		model.addAttribute("layout", "/layouts/left_layout");
		return user.getUserGrade() == UserRole.OPERATOR.getCode() ? "redirect:/view/real" : "redirect:/view/hist";
	}
}