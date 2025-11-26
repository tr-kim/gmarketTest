package com.web.gmarket.common.auth.service.impl;

import java.util.List;
import java.util.Optional;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.auth.service.CustomUserService;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.mapper.UserMapper;

@Service
public class CustomUserServiceImpl implements CustomUserService {
	
	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	public Optional<UserDto> login(UserDto userDto) {
		
		SqlSessionTemplate sqlSession = dynamicDataSourceService.getSqlSessionTemplate(ConstantsUtils.GMAREKT);
		UserMapper mapper = sqlSession.getMapper(UserMapper.class);
		
		UserDto user  = mapper.selectUserInfo(userDto);
		
		return Optional.ofNullable(user);
	}

	@Override
	public List<UserDto> selectUserList(UserDto userDto) {
		return null;
	}

}
