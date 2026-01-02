package com.web.gmarket.alarm.controller;

import java.util.LinkedHashMap;
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

@Controller
@RequestMapping("/view")
public class AlarmController {
	
	@Autowired
	private CommonService commonService;
	
	@GetMapping("/alarm")
	public String alarm(Model model) {
		
		// 서비스 명 목록 전체 조회
		List<Map<String, Object>> nameList = commonService.getServiceInfoMapper().selectServiceNameList().stream()
			    .map(dto -> {
			    	LinkedHashMap<String, Object> map = new LinkedHashMap<>();
			        map.put("companyCode", dto.getCompanyCode());
					map.put("code", dto.getSvcName());
			        map.put("name", dto.getSvcName());
			        return map;
			    })
			    .collect(Collectors.toList());
		
		model.addAttribute(ConstantsUtils.LIST, nameList);
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/top_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.ALARM);
		
		return "view/alarm";
	}

	@GetMapping("/alarm/left")
	public String left(Model model) {
		
		// 서비스 명 목록 전체 조회
		List<Map<String, Object>> nameList = commonService.getServiceInfoMapper().selectServiceNameList().stream()
			    .map(dto -> {
			    	LinkedHashMap<String, Object> map = new LinkedHashMap<>();
			        map.put("companyCode", dto.getCompanyCode());
					map.put("code", dto.getSvcName());
			        map.put("name", dto.getSvcName());
			        return map;
			    })
			    .collect(Collectors.toList());
		
		model.addAttribute(ConstantsUtils.LIST, nameList);
		model.addAttribute(ConstantsUtils.LAYOUT, "/layouts/left_layout");
		model.addAttribute(ConstantsUtils.ACTIVE, ConstantsUtils.ALARM);
		
		return "view/alarm";
	}
}