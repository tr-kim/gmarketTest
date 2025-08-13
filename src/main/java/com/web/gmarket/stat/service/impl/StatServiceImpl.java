package com.web.gmarket.stat.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.dbNameUtil;
import com.web.gmarket.stat.dto.StatCodeDto;
import com.web.gmarket.stat.dto.StatDto;
import com.web.gmarket.stat.mapper.StatCodeMapper;
import com.web.gmarket.stat.mapper.StatMapper;
import com.web.gmarket.stat.service.StatService;

@Service
public class StatServiceImpl implements StatService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	public int selectStatListCount(StatDto statDto) {

		int code = statDto.getCompanyCode();

		switch (code) {
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

		int code = statDto.getCompanyCode();

		switch (code) {
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
		return getStatMapper(dbNameUtil.getTableName(statDto.getCompanyCode())).selectAuctionStatListCount(statDto);
	}

	// 옥션 목록 조회
	public List<StatDto> selectAuctionStatList(StatDto statDto) {

		// 날짜 포맷 변환
		statDto.setStartDate(dateFormatConvert(statDto.getTimeType(), statDto.getStartDate()));
		statDto.setEndDate(dateFormatConvert(statDto.getTimeType(), statDto.getEndDate()));

		// 코드 목록 조회
		List<StatCodeDto> codeList = getStatCodeMapper().selectStatCodeList(statDto.getCompanyCode(), statDto.getTableCode());

		// 코드 목록 저장
		List<Integer> list = new ArrayList<>();
		for (StatCodeDto code : codeList) {
			list.add(code.getTableCode());
		}
		statDto.setTableCodeList(list);

		return getStatMapper(dbNameUtil.getTableName(statDto.getCompanyCode())).selectAuctionStatList(statDto);
	}

	// 지마켓 목록 갯수
	public int selectGmarketStatListCount(StatDto statDto) {
		return getStatMapper(dbNameUtil.getTableName(statDto.getCompanyCode())).selectGmarketStatListCount(statDto);
	}

	// 지마켓 목록 조회
	public List<StatDto> selectGmarketStatList(StatDto statDto) {
		// 날짜 포맷 변환
		statDto.setStartDate(dateFormatConvert(statDto.getTimeType(), statDto.getStartDate()));
		statDto.setEndDate(dateFormatConvert(statDto.getTimeType(), statDto.getEndDate()));

		return getStatMapper(dbNameUtil.getTableName(statDto.getCompanyCode())).selectGmarketStatList(statDto);
	}

	// 날짜 포맷변환
	public static String dateFormatConvert(int type, String date) {

		String str = "";

		switch (type) {
		case 1: // 시간
			DateTimeFormatter inputFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
			LocalDateTime dateTime = LocalDateTime.parse(date, inputFormat);
			str = dateTime.format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
			break;
		case 2: // 일
			LocalDate localDate = LocalDate.parse(date);
			str = localDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			break;
		case 3: // 월
			LocalDate obj = LocalDate.parse(date);
			YearMonth ym = YearMonth.from(obj);
			str = ym.format(DateTimeFormatter.ofPattern("yyyyMM"));
			break;
		case 4: // 연도
			LocalDate dateObj = LocalDate.parse(date);
			Year year = Year.from(dateObj);
			str = year.format(DateTimeFormatter.ofPattern("yyyy"));
			break;
		default:
			DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			LocalDateTime time = LocalDateTime.parse(date, format);
			str = time.format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
			break;
		}

		return str;
	}

	public StatMapper getStatMapper(String dbName) {
		StatMapper statMapper = dynamicDataSourceService.getMapper(dbName, StatMapper.class);
		return statMapper;
	}

	public StatCodeMapper getStatCodeMapper() {
		StatCodeMapper statCodeMapper = dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMAREKT, StatCodeMapper.class);
		return statCodeMapper;
	}
}
