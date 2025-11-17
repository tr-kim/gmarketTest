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

import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.service.StatCodeService;
import com.web.gmarket.stat.service.StatService;

@Service
public class StatServiceImpl implements StatService {

	@Autowired
	private CommonService commonService;
	
	@Autowired
	private StatCodeService statCodeService;

	@Override
	public int selectStatListCount(StatDto statDto) {

		switch (statDto.getCompanyCode()) {
			case ConstantsUtils.AUCTION_CODE:
				return selectAuctionStatListCount(statDto);
			case ConstantsUtils.GMARKET_CODE:
				return selectGmarketStatListCount(statDto);
			default:
				return selectAuctionStatListCount(statDto);
		}
	}

	@Override
	public List<StatDto> selectStatList(StatDto statDto) {
		
		// Controller 단에서 목록 조회랑 갯수 구하는 부분이 바뀌면 이 부분도 바뀌어야 한다.
		// 날짜 포맷 변환
		statDto.setStartDate(dateFormatConvert(statDto.getTimeType(), statDto.getStartDate(), StringUtils.defaultIfBlank(statDto.getStartHour().split(":")[0], "09")));
		statDto.setEndDate(dateFormatConvert(statDto.getTimeType(), statDto.getEndDate(), StringUtils.defaultIfBlank(statDto.getEndHour().split(":")[0], "09")));

		switch (statDto.getCompanyCode()) {
			case ConstantsUtils.AUCTION_CODE:
				return selectAuctionStatList(statDto);
			case ConstantsUtils.GMARKET_CODE:
				return selectGmarketStatList(statDto);
			default:
				return selectAuctionStatList(statDto);
		}
	}

	// 옥션 목록 갯수
	public int selectAuctionStatListCount(StatDto statDto) {
		return commonService.getStatMapper(ConstantsUtils.DB_AUCTION).selectAuctionStatListCount(statDto);
	}

	// 옥션 목록 조회
	public List<StatDto> selectAuctionStatList(StatDto statDto) {

		// 코드 목록 조회
		List<StatCodeDto> codeList = statCodeService.selectStatCodeList(statDto.getCompanyCode(), statDto.getTableCode());
		
		// 코드 목록 저장
		statDto.setTableCodeList(codeList.stream().map(StatCodeDto::getTableCode).collect(Collectors.toList()));
		
		// 테이블 이름 저장
		List<StatDto> list = commonService.getStatMapper(ConstantsUtils.DB_AUCTION).selectAuctionStatList(statDto);
		Map<Integer, String> codeMap = codeList.stream().collect(Collectors.toMap(StatCodeDto::getTableCode, StatCodeDto::getTableName, (v1, v2) -> v1));
//		list.forEach(dto -> dto.setTableName(StringUtils.defaultIfBlank(codeMap.get(dto.getTableCode()), "-")));
		list.forEach(dto -> dto.setTABLE_NAME(StringUtils.defaultIfBlank(codeMap.get(dto.getTABLE_CODE()), "-")));

		return list;
	}

	// 지마켓 목록 갯수
	public int selectGmarketStatListCount(StatDto statDto) {
		return commonService.getStatMapper(ConstantsUtils.DB_GMARKET).selectGmarketStatListCount(statDto);
	}

	// 지마켓 목록 조회
	public List<StatDto> selectGmarketStatList(StatDto statDto) {
		return commonService.getStatMapper(ConstantsUtils.DB_GMARKET).selectGmarketStatList(statDto);
	}

	// 날짜 포맷변환
	public static String dateFormatConvert(int type, String date, String hour) {

		switch (type) {
			case 1: // 시간
				DateTimeFormatter inputFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH");
				LocalDateTime dateTime = LocalDateTime.parse(String.format("%s %s", date, hour), inputFormat);
				
				return dateTime.format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
			case 2: // 일
				return LocalDate.parse(date).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			case 3: // 월
				LocalDate obj = LocalDate.parse(date);
				
				return YearMonth.from(obj).format(DateTimeFormatter.ofPattern("yyyyMM"));
			case 4: // 연도
				LocalDate dateObj = LocalDate.parse(date);
				
				return Year.from(dateObj).format(DateTimeFormatter.ofPattern("yyyy"));
			default:
				// 현재 시간
				Date today = new Date();
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy");
				
				return formatter.format(today);
		}

	}
}
