package com.web.gmarket.wait.service;

import java.util.List;

import com.web.gmarket.wait.dto.WaitDto;

public interface WaitService {

    List<WaitDto> getWaitList(WaitDto waitDto);

    int getWaitCount(WaitDto waitDto);
}
