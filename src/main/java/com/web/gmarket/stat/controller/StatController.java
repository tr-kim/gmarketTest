package com.web.gmarket.stat.controller;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.dto.StatCodeDto;

@Controller
@RequestMapping("/view")
public class StatController {
	
	@Autowired
	private CommonService commonService;
	
	@GetMapping("/stat")
	public String stat(Model model) {
		
		// 테이블 명 목록 전체 조회
		List<Map<String, Object>> codeList = commonService.getStatCodeMapper().selectStatCodeList(-1, 0).stream()
				.sorted(Comparator.comparing(StatCodeDto::getCompanyCode).thenComparing(StatCodeDto::getTableCode))
			    .map(dto -> {
			        Map<String, Object> map = new HashMap<>();
			        map.put("companyCode", dto.getCompanyCode());
			        map.put("code", dto.getTableCode());
			        map.put("name", dto.getTableName());
			        return map;
			    })
			    .collect(Collectors.toList());
		
		model.addAttribute(ConstantsUtils.LIST, codeList);
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.STAT);
		
		return "view/stat";
	}
	
	@GetMapping("/stat/left")
	public String left(Model model) {
		
		// 테이블 명 목록 전체 조회
		List<Map<String, Object>> codeList = commonService.getStatCodeMapper().selectStatCodeList(-1, 0).stream()
				.sorted(Comparator.comparing(StatCodeDto::getCompanyCode).thenComparing(StatCodeDto::getTableCode))
			    .map(dto -> {
			        Map<String, Object> map = new HashMap<>();
			        map.put("companyCode", dto.getCompanyCode());
			        map.put("code", dto.getTableCode());
			        map.put("name", dto.getTableName());
			        return map;
			    })
			    .collect(Collectors.toList());
		
		model.addAttribute(ConstantsUtils.LIST, codeList);
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.STAT);
		
		return "view/stat";
	}
}