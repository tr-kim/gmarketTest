package com.web.gmarket.real.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ServiceStatusFailoverDto {
	
	// 회사 코드(0: 옥션, 1: G마켓, 2: 스마일캐시)
	private String companyCode;
	
	// 서버 코드(1: 1번서버, 2: 2번서버)
	private String serverId;
	
	// 서버 상태 코드(A: Active, S: StandBy, D: ShutDown)
	private String serverStat;
	
	// 수동 전환 여부(ON: 수동전환, OFF: 자동전환)
	private String manualFlag;
}
