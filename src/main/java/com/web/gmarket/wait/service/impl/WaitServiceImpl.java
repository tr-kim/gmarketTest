package com.web.gmarket.wait.service.impl;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.web.gmarket.wait.dto.WaitDto;
import com.web.gmarket.wait.mapper.WaitMapper;
import com.web.gmarket.wait.service.WaitService;

@Service
public class WaitServiceImpl implements WaitService {

    private final WaitMapper waitMapper;
    //private final JdbcTemplate jdbcTemplate;

    public WaitServiceImpl(WaitMapper waitMapper, JdbcTemplate jdbcTemplate) {
        this.waitMapper = waitMapper;
        //this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<WaitDto> getWaitList(WaitDto waitDto) {
        return waitMapper.selectWaitList(waitDto);
    }

    @Override
    public int getWaitCount(WaitDto waitDto) {
        return waitMapper.selectWaitCount(waitDto);
    }
}
