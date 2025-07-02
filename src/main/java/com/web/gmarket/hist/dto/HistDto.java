package com.web.gmarket.hist.dto;

import java.util.List;

import lombok.Data;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistDto {
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String tranPhone;
	private List<String> monthTables;
}
