package com.web.gmarket.bulk.excel.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.bulk.broad.mapper.BroadcastMsgMapper;
import com.web.gmarket.bulk.excel.dto.ExcelSendDto;
import com.web.gmarket.bulk.excel.mapper.ExcelSendMapper;
import com.web.gmarket.bulk.excel.service.ExcelSendService;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.send.mapper.SendMapper;
import com.web.gmarket.user.dto.UserDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ExcelSendServiceImpl implements ExcelSendService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	@SuppressWarnings({"rawtypes" })
	public int insertExcelSend(UserDto userDto, ExcelSendDto dto) {

		String dbName = DBUtils.getDBName(dto.getLargeCategory());
		int resultCnt = -1;
		
		try {
			
			ArrayList excelData[] = getExcelData(dto);
			
			// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");
			LocalDateTime date = LocalDateTime.parse(excelData[0].get(2).toString(), formatter);
			String regTime = dto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : date.toString();
			int bulkCnt = dto.isTranCheckDefault() ? dto.getTranRangeEnd() : excelData.length;					// 대량 발송 갯수
			
			BroadcastMsgDto broadcastMsgDto = BroadcastMsgDto.builder()
					.bMsgKey(String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), dto.getUserId()))
					.loginId(dto.getUserId())
					.userId(dto.getUserId())
					.title((String) excelData[0].get(1))
					.cnt(bulkCnt)
					.succCnt(0)
					.failCnt(0)
					.status(1)
					.svcType(String.format("%s_%s", "EXCEL", dto.getMsgType().toUpperCase()))
					.sendInfo(dto.getSendInfo())
					.reqTime(regTime)
					.build();
			
			int cnt = getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);
			int sendCnt = 1;
			int k = dto.isTranCheckDefault() ? dto.getTranRangeStart() - 1 : 0;;
			
			if(cnt > 0) {
				String msgType = dto.getMsgType();
				
				
				
				for(;k < bulkCnt; k++, sendCnt++) {
					String sReqTime = dto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : (String) excelData[k].get(2);
					
					switch(msgType) {
						case ConstantsUtils.SMS:
							getSendMapper(dbName).insertSmsEvent(null);
					}
					
				}
				resultCnt = getMapper(dbName).insertExcelSend(dto);
			}
			
		} catch (ArrayIndexOutOfBoundsException e) {
			log.error(e.getMessage());
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			log.error(e.getMessage());
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			log.error(e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}

		return resultCnt;
	}

	// 엑셀에 있는 데이터를 ArrayList에 담기
	@SuppressWarnings({ "resource", "unchecked", "rawtypes" })
	public static ArrayList[] getExcelData(ExcelSendDto dto) throws FileNotFoundException, IllegalArgumentException, ArrayIndexOutOfBoundsException, Exception {
		
		String excelName = dto.getExcelFileName();
		String sheetName = dto.getSheet();
		String filePath = String.format("%s/%s", ConstantsUtils.EXCEL_PATH, excelName);

		File file = new File(filePath);

		if (!file.exists()) {
			throw new FileNotFoundException("엑셀 파일을 찾을 수 없습니다: " + excelName);
		}

		String extension = getFileExtension(filePath);

		Workbook workbook = null;
		Sheet sheet = null;
		Cell cell = null;
		Cell calleeCell = null;
		Cell callbackCell = null;

		int sheetNum = 0;

		try (FileInputStream fis = new FileInputStream(file)) {
			switch (extension.toLowerCase()) {
				case "xlsx":
					workbook = new XSSFWorkbook(fis);
					sheetNum = workbook.getNumberOfSheets();
					break;
				case "xls":
					workbook = new HSSFWorkbook(fis);
					sheetNum = workbook.getNumberOfSheets();
					break;
				default:
					throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + extension);
			}
		}

		String[] sheetNames = new String[sheetNum];

		int sheetCount = 0;
		for (int i = 0; i < sheetNum; i++) {

			sheetNames[i] = workbook.getSheetName(i);

			if (sheetNames[i].equals(sheetName)) {
				sheetCount = i;
			}
		}

		sheet = workbook.getSheetAt(sheetCount);
		int maxRows = sheet.getLastRowNum() + 1; // 행 수는 +1
		int maxCells = 0;
		for (Row row : sheet) {
			if (row != null && row.getLastCellNum() > maxCells) {
				maxCells = row.getLastCellNum();
			}
		}

		// 수신거부 체크인 경우 메시지 내용 + 수신거버 번호, 아닌 경우 메시지 내용
		String content = dto.isRejectCheckDefault() ? String.format("%s%s", dto.getMsgWrite(), dto.getRejectNum())
				: dto.getMsgWrite();
		String subject = dto.getMsgTitle();

		String excelValue = "";
		String calleeValue = "";
		String callbackValue = "";
		char code = 'A';

		int calleeFlag = dto.getCalleeSelect();
		int callbackFlag = dto.getCallbackSelect();

		Calendar cal = null;

		// 0 : 직접 입력일 경우 입력된 번호, 1 : 아닌 경우 시트 로우 값
		String callee = dto.getCalleeSelect() == 0 ? dto.getCallee()
				: String.format("%d", dto.getCallee().charAt(0) - 'A');
		String callback = dto.getCallbackSelect() == 0 ? dto.getCallback()
				: String.format("%d", dto.getCallback().charAt(0) - 'A');

		// 전송 유형 0 : 즉시, 1 : 예약
		int timeType = dto.getTimeType();

		// 분할 유형 true > 1 : 분할, false > 0
		int shareType = dto.isTranCheckDefault() ? 1 : 0;

		String cloneMessage[] = new String[maxRows];
		for (int i = 0; i < maxRows; i++) {
			cloneMessage[i] = content;
		}

		String cloneSubject[] = new String[maxRows];
		for (int i = 0; i < maxRows; i++) {
			cloneSubject[i] = subject;
		}

		ArrayList cellData[] = new ArrayList[maxRows];
		for (int i = 0; i < maxRows; i++) {
			cellData[i] = new ArrayList();
		}

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		LocalDateTime date = LocalDateTime.parse(dto.getSendTime(), formatter);

		int int_strY1 = -1;
		int int_strM1 = -1;
		int int_strD1 = -1;
		int int_reqHour = -1;
		int int_reqMin = -1;
		int int_reqSec = -1;
		int perMinuteFlag = 0;
		int cntFlag = 0;

		int tranCnt = dto.getSplitNum();
		int perMinute = dto.getSplitMinute();

		Date day = null;
		SimpleDateFormat sdf = null;

		for (int j = 0; j < maxRows; j++) {
			Row row = sheet.getRow(j);
			code = 'A';

			if (row != null) {
				if (calleeFlag == 1) { // 시트 선택
					calleeCell = row.getCell(Short.parseShort(callee));

					if (calleeCell != null) {
						switch (calleeCell.getCellType()) { // 셀의내용의 타입 선택
						case NUMERIC:
							calleeValue = "" + (int) calleeCell.getNumericCellValue(); // double형 -> long형
							break;
						case STRING:
							calleeValue = "" + calleeCell.getStringCellValue(); // String
							break;
						case BLANK:
							calleeValue = "";
							break;
						case ERROR:
							calleeValue = "" + calleeCell.getErrorCellValue(); // byte
							break;
						default:
						}
					} else {
						calleeValue = "";
					}
				}

				if (callbackFlag == 1) { // 시트 선택
					callbackCell = row.getCell(Short.parseShort(callback));

					if (callbackCell != null) {
						switch (callbackCell.getCellType()) { // 셀의내용의 타입 선택
							case NUMERIC:
								callbackValue = "" + (int) callbackCell.getNumericCellValue(); // double형 -> long형
								break;
							case STRING:
								callbackValue = "" + callbackCell.getStringCellValue(); // String
								break;
							case BLANK:
								callbackValue = "";
								break;
							case ERROR:
								callbackValue = "" + callbackCell.getErrorCellValue(); // byte
								break;
							default:
						}
					} else {
						callbackValue = "";
					}
				}

				for (short c = 0; c < maxCells; c++) {
					cell = row.getCell(c);

					if (cell != null) {
						switch (cell.getCellType()) { // 셀의내용의 타입 선택
							case NUMERIC:
								excelValue = "" + (int) cell.getNumericCellValue(); // double형 -> long형
								break;
							case STRING:
								excelValue = "" + cell.getStringCellValue(); // String
								break;
							case BLANK:
								excelValue = "";
								break;
							case ERROR:
								excelValue = "" + cell.getErrorCellValue(); // byte
								break;
							default:
						}

						// 메세지 출력
						try {
							
							cloneMessage[j] = cloneMessage[j].replace("[%" + code + "%]", excelValue);
							cloneSubject[j] = cloneSubject[j].replace("[%" + code + "%]", excelValue);
							
						} catch (ArrayIndexOutOfBoundsException e) {
							throw new ArrayIndexOutOfBoundsException(e.getMessage());
						}
					}

					if (c == 0) {

						// 수신번호 저장 [0]
						cellData[j].add((calleeFlag == 1 ? calleeValue : callee));

						// 회신번호 저장 [1]
						cellData[j].add((callbackFlag == 1 ? callbackValue : callback));

						// 전송시간 출력 [2]
						if (timeType == 0) { // 즉시
							cellData[j].add("즉시전송");

						} else if (timeType == 1) { // 예약

							if (shareType == 1) { // 분할전송일시
								cal = Calendar.getInstance();
								if (perMinuteFlag == 0) {
									// timeType
									// 0: 즉시 1:예약
									int_strY1 = date.getYear();
									int_strM1 = date.getMonthValue();
									int_strD1 = date.getDayOfMonth();
									int_reqHour = date.getHour();
									int_reqMin = date.getMinute();
									int_reqSec = date.getSecond();
									perMinuteFlag = 1;
								} else {
									if (cntFlag % tranCnt == 0) {
										int_reqMin += perMinute;
									}
								}

								cntFlag++;

								if (int_reqMin > 59) {
									int_reqHour += (int_reqMin / 60); // 60으로 나눠지는만큼 몫이 더해져야할 시간이므로 더해준다.
									int_reqMin %= 60;

									if (int_reqHour > 23) { // 시간이 24시간이상일경우 날짜를 하루 더해준다.
										int_strD1 += (int_reqHour / 24);
										int_reqHour %= 24;
										
										int[] addMonthAndDate =  checkValidDate(int_strY1, int_strM1, int_strD1);
										int_strY1 = addMonthAndDate[0]; // 변환된 년
										int_strM1 = addMonthAndDate[1]; // 변환된 월
										int_strD1 = addMonthAndDate[2]; // 변환된 일
									}
								}

								cal.set(int_strY1, int_strM1 - 1, int_strD1, int_reqHour, int_reqMin, int_reqSec);
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");

							} else { // 분할전송이 아닐시

								cal = Calendar.getInstance();
								cal.set(date.getYear(), date.getMonthValue() - 1, date.getDayOfMonth(), date.getHour(), date.getMinute(), date.getSecond());
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							}

							log.info("sdf.format(day) = [" + sdf.format(day) + "]");
							
							// 예약시간 저장 [2]
							cellData[j].add(sdf.format(day));
						}
					}
					
					code++;
				}
				
			} else {
				excelValue = "";
				calleeValue = "";
				callbackValue = "";

				for (short c = 0; c < maxCells; c++) {
					try {

						cloneMessage[j] = cloneMessage[j].replace("[%" + code + "%]", "");
						cloneSubject[j] = cloneSubject[j].replace("[%" + code + "%]", "");
						
					} catch (ArrayIndexOutOfBoundsException e) {
						throw new ArrayIndexOutOfBoundsException(e.getMessage());
					}

					if (c == 0) {

						// 수신번호 저장 [0]
						cellData[j].add((calleeFlag == 1 ? calleeValue : callee));

						// 회신번호 저장 [1]
						cellData[j].add((callbackFlag == 1 ? callbackValue : callback));

						// 전송시간 출력 [2]
						if (timeType == 0) { // 즉시
							cellData[j].add("즉시전송");

						} else if (timeType == 1) { // 예약
							if (shareType == 1) { // 분할전송일시
								cal = Calendar.getInstance();
								
								if (perMinuteFlag == 0) {
									// timeType
									// 0: 즉시 1:예약
									int_strY1 = date.getYear();
									int_strM1 = date.getMonthValue();
									int_strD1 = date.getDayOfMonth();
									int_reqHour = date.getHour();
									int_reqMin = date.getMinute();
									int_reqSec = date.getSecond();
									perMinuteFlag = 1;
								} else {
									if (cntFlag % tranCnt == 0) {
										int_reqMin += perMinute;
									}
								}
								
								cntFlag++;
								
								if (int_reqMin > 59) {
									int_reqHour += (int_reqMin / 60); // 60으로 나눠지는만큼 몫이 더해져야할 시간이므로 더해준다.
									int_reqMin %= 60;
									if (int_reqHour > 23) { // 시간이 24시간이상일경우 날짜를 하루 더해준다.
										int_strD1 += (int_reqHour / 24);
										int_reqHour %= 24;

										int[] addMonthAndDate = checkValidDate(int_strY1, int_strM1, int_strD1);
										
										int_strY1 = addMonthAndDate[0]; // 변환된 년
										int_strM1 = addMonthAndDate[1]; // 변환된 월
										int_strD1 = addMonthAndDate[2]; // 변환된 일
									}
								}
								
								cal.set(int_strY1, int_strM1 - 1, int_strD1, int_reqHour, int_reqMin, int_reqSec);
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							} else { // 분할전송이 아닐시

								cal = Calendar.getInstance();
								cal.set(date.getYear(), date.getMonthValue() - 1, date.getDayOfMonth(),
										date.getHour(), date.getMinute(), date.getSecond());
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							}
							
							log.info("sdf.format(day) = [" + sdf.format(day) + "]");
							
							// 예약시간 저장 [2]
							cellData[j].add(sdf.format(day));
						}
					}
				}
				code++;
			}
		}

		return cellData;
	}
	
	
	

	// 확장자 가져오기
	private static String getFileExtension(String fileName) {
		return fileName.substring(fileName.lastIndexOf('.') + 1);
	}

	// 날짜 체크
	public static int[] checkValidDate(int year, int month, int date) {
		int[] addMonthAndDate = new int[3];
		int maxDates = getDatesOfMonth(year, month);

		// 넘어온 날짜가 해당월의 날짜보다 높을시에
		// 같거나 작을 경우에는 그대로 출력하면 되므로
		if (date > maxDates) {
			if ((date / maxDates == 1) && month == 12) {
				addMonthAndDate[0] = ++year;
			} else {
				addMonthAndDate[0] = year;
			}
			addMonthAndDate[1] = checkMaxMonth((date / maxDates) + month);
			addMonthAndDate[2] = date % maxDates;
		} else {
			addMonthAndDate[0] = year;
			addMonthAndDate[1] = month;
			addMonthAndDate[2] = date;
		}
		
		return addMonthAndDate;
	}

	// 날짜 월 가져오기
	public static int getDatesOfMonth(int year, int currentMonth) {
		int[] month = new int[12];
		month[0] = 31; // 1월
		month[1] = leapYear(year); // 2월
		month[2] = 31; // 3월
		month[3] = 30; // 4월
		month[4] = 31; // 5월
		month[5] = 30; // 6월
		month[6] = 31; // 7월
		month[7] = 31; // 8월
		month[8] = 30; // 9월
		month[9] = 31; // 10월
		month[10] = 30; // 11월
		month[11] = 31; // 12월
		return month[currentMonth - 1];
	}

	// 최대 월 가져오기
	public static int checkMaxMonth(int month) {
		if (month > 12)
			month -= 12;
		return month;
	}

	// 운년 체크
	public static int leapYear(int year) {
		if (year % 4 == 0) {
			if (year % 100 == 0) {
				if (year % 400 == 0) {
					return 29; // 윤년입니다.
				} else {
					return 28; // 윤년이 아닙니다.
				}
			}
		}
		return 28;
	}

	public ExcelSendMapper getMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, ExcelSendMapper.class);
	}
	
	public BroadcastMsgMapper getBroadcastMsgMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, BroadcastMsgMapper.class);
	}
	
	public SendMapper getSendMapper(String dbName) {
		return dynamicDataSourceService.getMapper(dbName, SendMapper.class);
	}
}
