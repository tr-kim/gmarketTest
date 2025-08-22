package com.web.gmarket.stat.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.mapper.StatMapper;
import com.web.gmarket.stat.service.StatCodeService;
import com.web.gmarket.stat.service.StatService;

@Service
public class StatServiceImpl implements StatService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;
	
	@Autowired
	private StatCodeService statCodeService;

	@Override
	public int selectStatListCount(StatDto statDto) {

		switch (statDto.getCompanyCode()) {
			case ConstantsUtils.AUCTION_CODE:
				return selectAuctionStatListCount(statDto);
			case ConstantsUtils.GMAREKT_CODE:
				return selectGmarketStatListCount(statDto);
			default:
				return selectAuctionStatListCount(statDto);
		}
	}

	@Override
	public List<StatDto> selectStatList(StatDto statDto) {

		switch (statDto.getCompanyCode()) {
			case ConstantsUtils.AUCTION_CODE:
				return selectAuctionStatList(statDto);
			case ConstantsUtils.GMAREKT_CODE:
				return selectGmarketStatList(statDto);
			default:
				return selectAuctionStatList(statDto);
		}
	}

	// 옥션 목록 갯수
	public int selectAuctionStatListCount(StatDto statDto) {
		return getMapper(ConstantsUtils.DB_AUCTION).selectAuctionStatListCount(statDto);
	}

	// 옥션 목록 조회
	public List<StatDto> selectAuctionStatList(StatDto statDto) {

		// 날짜 포맷 변환
		statDto.setStartDate(dateFormatConvert(statDto.getTimeType(), statDto.getStartDate()));
		statDto.setEndDate(dateFormatConvert(statDto.getTimeType(), statDto.getEndDate()));

		// 코드 목록 조회
		List<StatCodeDto> codeList = statCodeService.selectStatCodeList(statDto.getCompanyCode(), statDto.getTableCode());
		
		// 코드 목록 저장
		List<Integer> list = codeList.stream().map(StatCodeDto::getTableCode).collect(Collectors.toList());
		statDto.setTableCodeList(list);
		
		// 테이블 이름 저장
		List<StatDto> selectAuctionStatList = getMapper(ConstantsUtils.DB_AUCTION).selectAuctionStatList(statDto);
		Map<Integer, String> codeMap = codeList.stream().collect(Collectors.toMap(StatCodeDto::getTableCode, StatCodeDto::getTableName));
		
		for(StatDto dto : selectAuctionStatList) {
			dto.setTableName(StringUtils.defaultIfBlank(codeMap.get(dto.getTableCode()), "-"));
		}

		return selectAuctionStatList;
	}

	// 지마켓 목록 갯수
	public int selectGmarketStatListCount(StatDto statDto) {
		return getMapper(ConstantsUtils.DB_GMAREKT).selectGmarketStatListCount(statDto);
	}

	// 지마켓 목록 조회
	public List<StatDto> selectGmarketStatList(StatDto statDto) {
		// 날짜 포맷 변환
		statDto.setStartDate(dateFormatConvert(statDto.getTimeType(), statDto.getStartDate()));
		statDto.setEndDate(dateFormatConvert(statDto.getTimeType(), statDto.getEndDate()));

		return getMapper(ConstantsUtils.DB_GMAREKT).selectGmarketStatList(statDto);
	}

	// 날짜 포맷변환
	public static String dateFormatConvert(int type, String date) {

		switch (type) {
			case 1: // 시간
				DateTimeFormatter inputFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
				LocalDateTime dateTime = LocalDateTime.parse(date, inputFormat);
				
				return dateTime.format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
			case 2: // 일
				LocalDate localDate = LocalDate.parse(date);
				
				return localDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			case 3: // 월
				LocalDate obj = LocalDate.parse(date);
				YearMonth ym = YearMonth.from(obj);
				
				return ym.format(DateTimeFormatter.ofPattern("yyyyMM"));
			case 4: // 연도
				LocalDate dateObj = LocalDate.parse(date);
				Year year = Year.from(dateObj);
				
				return year.format(DateTimeFormatter.ofPattern("yyyy"));
			default:
				// 현재 시간
				Date today = new Date();
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy");
				
				return formatter.format(today);
		}

	}

	public StatMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, StatMapper.class);
	}
}
