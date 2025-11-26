package com.web.gmarket.bulk.excel.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.broad.dto.BroadcastMsgDto;
import com.web.gmarket.bulk.excel.dto.ExcelSendDto;
import com.web.gmarket.bulk.excel.service.ExcelSendService;
import com.web.gmarket.common.dto.CommonSendDto;
import com.web.gmarket.common.service.CommonService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.common.vo.FtpDto;
import com.web.gmarket.common.vo.UploadProgress;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ExcelSendServiceImpl implements ExcelSendService {
	
	private final CommonService commonService;
	
	public ExcelSendServiceImpl(CommonService commonService) {
		this.commonService = commonService;
	}
	
	int EXCEL_CELL_MAX = ConstantsUtils.EXCEL_CELL_MAX;
	int EXCEL_ROW_MAX = ConstantsUtils.EXCEL_ROW_MAX;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void insertExcelSend(ExcelSendDto dto, Map<String, UploadProgress> uploadStatus, String jobId) throws Exception {

		String dbName = DBUtils.getDBName(dto.getCompanyCode());

		// 초기값 설정
		List<String> cloneMessage = new ArrayList<>(); // 메시지 내용
		List<String> cloneSubject = new ArrayList<>(); // 메시지 제목
		List<List<String>> cellData = new ArrayList<>(); // 엑셀 데이터

		try {

			// 엑셀 데이터 가져오기
			uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "엑셀 데이터 가져오기 시작"));
			int maxRows = getExcelData(dto, cellData, cloneMessage, cloneSubject, uploadStatus, jobId);
			uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "엑셀 데이터 가져오기 성공"));
			
			// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
			DateTimeFormatter orgFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

			// yyyyMMddHHmmssSSS => yyyy-MM-dd HH:mm:ss:SSS 변환
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
			String reqTime = dto.getTimeType() == 0 ? "CONVERT(CHAR(20), GETDATE(), 120)" : LocalDateTime.parse(cellData.get(0).get(2).toString(), orgFormatter).format(formatter);

			int bulkCnt = dto.isTranCheckDefault() ? dto.getTranRangeEnd() : maxRows; // 대량 발송 갯수
			String bMsgKey = String.format("%s%s", Long.toString(System.currentTimeMillis()).substring(0, 10), dto.getUserId()); // 대량 발송 키 생성
			String msgType = dto.getMsgType().toLowerCase();

			// MMS일 경우 이미지 파일 업로드
			if(ConstantsUtils.MMS.equals(msgType)) {
				
				try {
					
					// FTP 연결
//					FTPClient ftpClient = commonService.createConnection(dto.getCompanyCode(), ConstantsUtils.ACTIVE);
					
					// 파일 정보 셋팅
					FtpDto ftpDto = FtpDto.builder()
							.companyCode(dto.getCompanyCode())
							.msgType(msgType)
							.sendType(ConstantsUtils.SEND_TYPE_EXCEL)
							.imageName01(dto.getImageName01())
							.imageName02(dto.getImageName02())
							.build();
					
					// 파일 업로드
//					commonService.uploadFile(ftpClient, ftpDto);
					commonService.uploadFile(ftpDto);
					
					// 파일 경로 저장
					dto.setImagePath01(ftpDto.getImagePath01());
					dto.setImagePath02(ftpDto.getImagePath02());
					
				} catch (IOException e) {
					throw new IOException(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> insertExcelSend FTP 에러 발생 ", e);
				}
			}
			
			// 데이터 설정
			BroadcastMsgDto broadcastMsgDto = BroadcastMsgDto.builder()
					.bMsgKey(bMsgKey)
					.loginId(dto.getUserId())
					.userId(dto.getUserId())
					.title(cloneSubject.get(0).trim())
					.msg(cloneMessage.get(0).trim())
					.callbackNo(cellData.get(0).get(1))
					.cnt(bulkCnt)
					.succCnt(0)
					.failCnt(0)
					.status(1)
					.svcType(String.format("%s_%s", "EXCEL", msgType.toUpperCase()))
					.sendInfo(dto.getSendInfo())
					.reqTime(reqTime)
					.timeType(dto.getTimeType())
					.build();
			
			// 대량 발송 등록
			commonService.getBroadcastMsgMapper(dbName).insertBroadcastMsg(broadcastMsgDto);

			uploadStatus.put(jobId, new UploadProgress(0, 0, bulkCnt, "엑셀 데이터 DB 등록 시작"));
			
			if (bulkCnt > 0) {

				int succCnt = 0;
				int failCnt = 0;
				int sendCnt = 1;
				
				int k = dto.isTranCheckDefault() ? dto.getTranRangeStart() - 1 : 0;

				for (; k < bulkCnt; k++, sendCnt++) {

					var item = cellData.get(k);
					
					// String yyyyMMddHHmmssSSS => Date yyyyMMddHHmmssSSS 변환
					// 날짜 설정
					String sReqTime = dto.getTimeType() == 0 ? "CONVERT(char(20), GETDATE(), 120)" : LocalDateTime.parse(item.get(2).toString(), orgFormatter).format(formatter);

					// 데이터 설정
					CommonSendDto commonSendDto = CommonSendDto.builder().build();
					commonSendDto.setTranDate(sReqTime);
					commonSendDto.setTranPhone(((String) item.get(0)).trim());
					commonSendDto.setTranCallback(((String) item.get(1)).trim());
					commonSendDto.setTranStatus(1);
					commonSendDto.setTranMsg(cloneMessage.get(k).toString());
					commonSendDto.setBMsgKey(bMsgKey);
					commonSendDto.setReserved3(dto.getReserved());
					commonSendDto.setTimeType(dto.getTimeType());
					
					// MMS인 경우 이미지 경로 저장 및 제목 저장
					if(ConstantsUtils.MMS.equals(msgType)) {
						commonSendDto.setImagePath01(dto.getImagePath01());
						commonSendDto.setImagePath02(dto.getImagePath02());
						commonSendDto.setTranTitle(cloneSubject.get(k).toString());
						
					} else if(ConstantsUtils.LMS.equals(msgType)) commonSendDto.setTranTitle(cloneSubject.get(k).toString());	// LMS인 경우 제목 저장

					int flagCnt = 0;
					switch (msgType) {
						case ConstantsUtils.SMS:
							flagCnt = commonService.getCommonSendMapper(dbName).insertSmsEvent(commonSendDto);
							break;
						case ConstantsUtils.LMS:
							flagCnt = commonService.getCommonSendMapper(dbName).insertLmsEvent(commonSendDto);
							break;
						case ConstantsUtils.MMS:
							flagCnt = commonService.getCommonSendMapper(dbName).insertMmsEvent(commonSendDto);
							break;
						default:
							throw new IllegalArgumentException(String.format("%s%s", "혀용되지 않은 메시지 타입입니다 : ", msgType));
					}

					commonService.getBroadcastMsgMapper(dbName).updateBroadcastMsgCountByType(bMsgKey, flagCnt > 0 ? ++succCnt : ++failCnt, flagCnt > 0 ? ConstantsUtils.FLAG_T : ConstantsUtils.FLAG_F);
					
					int progress = (int) (((float) sendCnt / bulkCnt) * 100);
					uploadStatus.put(jobId, new UploadProgress(progress, sendCnt, bulkCnt, String.format("%d/%d 행 처리 완료", sendCnt, bulkCnt)));
				}
			}
			
			uploadStatus.put(jobId, new UploadProgress(100, bulkCnt, bulkCnt, String.format("엑셀 데이터 완료", bulkCnt, bulkCnt)));

		} catch (Exception e) {
			uploadStatus.put(jobId, new UploadProgress(-1, 0, 0, "엑셀 데이터 DB 등록 오류 발생"));
			throw e;
		}
	}

	// 엑셀에 있는 데이터를 ArrayList에 담기
	@SuppressWarnings({ "resource", "unchecked", "rawtypes" })
	public int getExcelData(ExcelSendDto dto, List<List<String>> cellData, List<String> cloneMessage,
			List<String> cloneSubject, Map<String, UploadProgress> uploadStatus, String jobId)
			throws FileNotFoundException, IllegalArgumentException, ArrayIndexOutOfBoundsException, Exception {

		String excelName = dto.getExcelFileName();
		String sheetName = dto.getSheet();
		String filePath = String.format("%s/%s", commonService.getFilePath(ConstantsUtils.EXCEL), excelName);
		File file = new File(filePath);

		uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "엑셀 파일 확인"));
		if (!file.exists()) throw new FileNotFoundException("엑셀 파일을 찾을 수 없습니다: " + excelName);
		uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "엑셀 파일 읽기 성공"));

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
					throw new IllegalArgumentException(String.format("%s%s", "지원하지 않는 파일 형식입니다: ", extension));
			}
		}

		String[] sheetNames = new String[sheetNum];

		int sheetCount = 0;
		for (int i = 0; i < sheetNum; i++) {

			sheetNames[i] = workbook.getSheetName(i);

			if (sheetNames[i].equals(sheetName)) sheetCount = i;
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
		String content = dto.isRejectCheckDefault() ? String.format("%s%s", dto.getMsgWrite(), dto.getRejectNum()) : dto.getMsgWrite();
		String subject = dto.getMsgTitle();

//		String[] cloneMessage = new String[maxRows];
//		for (int i = 0; i < maxRows; i++) {
//			cloneMessage[i] = content;
//		}

//		String[] cloneSubject = new String[maxRows];
//		for (int i = 0; i < maxRows; i++) {
//			cloneSubject[i] = subject;
//		}

//		String[] cellData = new ArrayList[maxRows];
//		for (int i = 0; i < maxRows; i++) {
//			cellData[i] = new ArrayList();
//		}

		for (int i = 0; i < maxRows; i++) {
			cloneMessage.add(content);
			cloneSubject.add(subject);
			cellData.add(new ArrayList());
		}

		// 전송 유형 0 : 즉시, 1 : 예약
		int timeType = dto.getTimeType();

		// 분할 유형 true > 1 : 분할, false > 0
		int shareType = dto.isTranCheckDefault() ? 1 : 0;

		// 0 : 직접 입력일 경우 입력된 번호, 1 : 아닌 경우 시트 Row 값
		String callee = dto.getCalleeSelect() == 0 ? dto.getCallee() : String.format("%d", dto.getCallee().charAt(0) - 'A');
		String callback = dto.getCallbackSelect() == 0 ? dto.getCallback() : String.format("%d", dto.getCallback().charAt(0) - 'A');

		// 수신번호 유형 0 : 직접입력, 1 : 시트 선택
		int calleeFlag = dto.getCalleeSelect();

		// 발신번호 유형 0 : 직접입력, 1 : 시트 선택
		int callbackFlag = dto.getCallbackSelect();
		
		// 날짜 형식 변환
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		
		// 분할 전송 아닌 경우 현재시간, 전송인 경우 입력된 값으로 변환
		LocalDateTime date = ConstantsUtils.FLAG_N.equals(dto.getSplitSend()) ? LocalDateTime.now() : LocalDateTime.parse(dto.getSendTime(), formatter);

		int intStrY1 = -1;
		int intStrM1 = -1;
		int intStrD1 = -1;
		int intReqHour = -1;
		int intReqMin = -1;
		int intReqSec = -1;
		
		int perMinuteFlag = 0;
		int cntFlag = 0;

		int tranCnt = dto.getSplitNum();
		int perMinute = dto.getSplitMinute();

		String excelValue = "";
		String calleeValue = "";
		String callbackValue = "";
		char code = 'A';

		Date day = null;
		SimpleDateFormat sdf = null;
		Calendar cal = null;
		
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
								break;
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
								break;
						}

						// 메세지 출력
						try {

//							cloneMessage[j] = cloneMessage[j].replace("[%" + code + "%]", excelValue);
//							cloneSubject[j] = cloneSubject[j].replace("[%" + code + "%]", excelValue);

							cloneMessage.set(j, cloneMessage.get(j).replace("[%" + code + "%]", excelValue));
							cloneSubject.set(j, cloneSubject.get(j).replace("[%" + code + "%]", excelValue));

						} catch (ArrayIndexOutOfBoundsException e) {
							throw new ArrayIndexOutOfBoundsException(e.getMessage());
						}
					}

					if (c == 0) {

						// 수신번호 저장 [0]
//						cellData[j].add((calleeFlag == 1 ? calleeValue : callee));
						cellData.get(j).add(calleeFlag == 1 ? calleeValue : callee);

						// 발신번호 저장 [1]
//						cellData[j].add((callbackFlag == 1 ? callbackValue : callback));
						cellData.get(j).add(callbackFlag == 1 ? callbackValue : callback);

						// 전송시간 출력 [2]
						if (timeType == 0) { // 즉시
//							cellData[j].add("즉시전송");
							cellData.get(j).add("즉시전송");

						} else if (timeType == 1) { // 예약

							if (shareType == 1) { // 분할전송일시
								
								if (perMinuteFlag == 0) {
									
									// timeType 0: 즉시 1:예약
									intStrY1 = date.getYear();
									intStrM1 = date.getMonthValue();
									intStrD1 = date.getDayOfMonth();
									intReqHour = date.getHour();
									intReqMin = date.getMinute();
									intReqSec = date.getSecond();
									perMinuteFlag = 1;
								} else {
									if (cntFlag % tranCnt == 0) intReqMin += perMinute;
								}

								cntFlag++;

								if (intReqMin > 59) {
									intReqHour += (intReqMin / 60); // 60으로 나눠지는만큼 몫이 더해져야할 시간이므로 더해준다.
									intReqMin %= 60;

									if (intReqHour > 23) { // 시간이 24시간이상일경우 날짜를 하루 더해준다.
										intStrD1 += (intReqHour / 24);
										intReqHour %= 24;

										int[] addMonthAndDate = checkValidDate(intStrY1, intStrM1, intStrD1);
										intStrY1 = addMonthAndDate[0]; // 변환된 년
										intStrM1 = addMonthAndDate[1]; // 변환된 월
										intStrD1 = addMonthAndDate[2]; // 변환된 일
									}
								}
								
								cal = Calendar.getInstance();
								cal.set(intStrY1, intStrM1 - 1, intStrD1, intReqHour, intReqMin, intReqSec);
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");

							} else { // 분할전송이 아닐시

								cal = Calendar.getInstance();
								cal.set(date.getYear(), date.getMonthValue(), date.getDayOfMonth(), date.getHour(), date.getMinute(), date.getSecond());
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							}

							log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 전송 일자: {}", sdf.format(day));

							// 예약시간 저장 [2]
//							cellData[j].add(sdf.format(day));
							cellData.get(j).add(sdf.format(day));
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

//						cloneMessage[j] = cloneMessage[j].replace("[%" + code + "%]", "");
//						cloneSubject[j] = cloneSubject[j].replace("[%" + code + "%]", "");
						
						cloneMessage.set(j, cloneMessage.get(j).replace("[%" + code + "%]", ""));
						cloneSubject.set(j, cloneSubject.get(j).replace("[%" + code + "%]", ""));

					} catch (ArrayIndexOutOfBoundsException e) {
						throw new ArrayIndexOutOfBoundsException(e.getMessage());
					}

					if (c == 0) {

						// 수신번호 저장 [0]
//						cellData[j].add((calleeFlag == 1 ? calleeValue : callee));
						cellData.get(j).add(calleeFlag == 1 ? calleeValue : callee);

						// 발신번호 저장 [1]
//						cellData[j].add((callbackFlag == 1 ? callbackValue : callback));
						cellData.get(j).add(callbackFlag == 1 ? callbackValue : callback);

						// 전송시간 출력 [2]
						if (timeType == 0) { // 즉시
//							cellData[j].add("즉시전송");
							cellData.get(j).add("즉시전송");

						} else if (timeType == 1) { // 예약
							if (shareType == 1) { // 분할전송일시
								
								if (perMinuteFlag == 0) {
									// timeType  0: 즉시 1:예약
									intStrY1 = date.getYear();
									intStrM1 = date.getMonthValue();
									intStrD1 = date.getDayOfMonth();
									intReqHour = date.getHour();
									intReqMin = date.getMinute();
									intReqSec = date.getSecond();
									perMinuteFlag = 1;
									
								} else {
									if (cntFlag % tranCnt == 0) intReqMin += perMinute;
								}

								cntFlag++;

								if (intReqMin > 59) {
									intReqHour += (intReqMin / 60); // 60으로 나눠지는만큼 몫이 더해져야할 시간이므로 더해준다.
									intReqMin %= 60;
									
									if (intReqHour > 23) { // 시간이 24시간이상일경우 날짜를 하루 더해준다.
										intStrD1 += (intReqHour / 24);
										intReqHour %= 24;

										int[] addMonthAndDate = checkValidDate(intStrY1, intStrM1, intStrD1);

										intStrY1 = addMonthAndDate[0]; // 변환된 년
										intStrM1 = addMonthAndDate[1]; // 변환된 월
										intStrD1 = addMonthAndDate[2]; // 변환된 일
									}
								}

								cal = Calendar.getInstance();
								cal.set(intStrY1, intStrM1 - 1, intStrD1, intReqHour, intReqMin, intReqSec);
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							} else { // 분할전송이 아닐시

								cal = Calendar.getInstance();
								cal.set(date.getYear(), date.getMonthValue(), date.getDayOfMonth(), date.getHour(), date.getMinute(), date.getSecond());
								day = cal.getTime();
								sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
							}

							log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 전송 일자: {}", sdf.format(day));

							// 예약시간 저장 [2]
//							cellData[j].add(sdf.format(day));
							cellData.get(j).add(sdf.format(day));
						}
					}
				}
				code++;
			}
		}

		return maxRows;
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
		return month > 12 ? month -= 12 : month;
	}

	// 운년 체크
	public static int leapYear(int year) {
		if (year % 4 == 0) {
			if (year % 100 == 0) {
				if (year % 400 == 0) return 29; // 윤년입니다.
				else return 28; // 윤년이 아닙니다.
			}
		}
		
		return 28;
	}

	@Override
	public Map<String, Object> uploadExcelFile(MultipartFile file, String userId) throws IOException {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로 생성
		File dir = new File(commonService.getFilePath(ConstantsUtils.EXCEL));
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		// 2. 저장 파일명 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());
		
		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null) {
			result.put("status", "error");
			result.put("message", "엑셀 파일 이름이 존재하지 않습니다.");
			return result;
		}
		String ext = "";
		int dotIndex = originalFilename.lastIndexOf(".");
		if (dotIndex != -1) {
			ext = originalFilename.substring(dotIndex); // 확장자 추출
		}
		
		// String savedFileName = "SEND_" + nowStr + "_" + originalFilename;
		String savedFileName = "SEND_" + nowStr + "_" + userId + ext;
		File savedFile = new File(commonService.getFilePath(ConstantsUtils.EXCEL), savedFileName);
		
		Workbook workbook = null;
		try {
			// 3. 파일 저장
			file.transferTo(savedFile);
			
			// 4. Workbook 생성
			try (InputStream is = new FileInputStream(savedFile)) {
				if (savedFileName.endsWith(".xls")) {
					workbook = new HSSFWorkbook(is);
				} else if (savedFileName.endsWith(".xlsx")) {
					workbook = new XSSFWorkbook(is);
				} else {
					result.put("status", "error");
					result.put("message", "엑셀 파일 형식이 아닙니다.");
					return result;
				}
				
				// 5. 시트 이름 추출
				List<String> sheetNames = new ArrayList<>();
				int sheetNum = workbook.getNumberOfSheets();
				for (int i = 0; i < sheetNum; i++) {
					sheetNames.add(workbook.getSheetName(i));
				}
				
				data.put("excelFile", savedFileName);
				data.put("sheetName", sheetNames);
				
				result.put("status", "success");
				result.put("retData", data);
			}
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
			
			// 파일 삭제
			// savedFile.delete();
		}
		
		return result;
	}

	@Override
	public Map<String, Object> validateExcelFile(String excelFile, String sheetName) throws IOException {
Map<String, Object> result = new HashMap<>();
		
		// 1. 파일 찾기
		File file = new File(commonService.getFilePath(ConstantsUtils.EXCEL), excelFile);
		if (!file.exists()) {
			result.put("status", "error");
			result.put("message", "파일을 찾을 수 없습니다.");
			return result;
		}
		
		// 2. 확장자에 따라 Workbook 생성
		Workbook workbook = null;
		try (InputStream is = new FileInputStream(file)) {
			if (excelFile.endsWith(".xls")) {
				workbook = new HSSFWorkbook(is);
			} else if (excelFile.endsWith(".xlsx")) {
				workbook = new XSSFWorkbook(is);
			} else {
				result.put("status", "error");
				result.put("message", "엑셀 파일 형식이 아닙니다.");
				return result;
			}
			
			// 3. 시트 찾기
			Sheet sheet = workbook.getSheet(sheetName);
			if (sheet == null) {
	            result.put("status", "error");
	            result.put("message", "해당 시트를 찾을 수 없습니다.");
	            return result;
			}
			
			// 4. 최대 행/열 계산
			// 내용이 없어도 개수 포함
			int maxRows = sheet.getLastRowNum() + 1; // 행 수는 +1
			int maxCells = 0;
			for (Row row : sheet) {
				if (row != null && row.getLastCellNum() > maxCells) {
					maxCells = row.getLastCellNum();
				}
			}
			
			// 4. 최대 행/열 계산
			// 내용이 없으면 개수 제외
			/*int maxRows = sheet.getPhysicalNumberOfRows();
			int maxCells = 0;
			for (int i = 0; i < maxRows; i++) {
				Row row = sheet.getRow(i);
				if (row != null && row.getPhysicalNumberOfCells() > maxCells) {
					maxCells = row.getPhysicalNumberOfCells();
				}
			}*/
			
			if (maxRows > EXCEL_ROW_MAX) {
				result.put("status", "error");
				result.put("message", "엑셀파일은 " + EXCEL_ROW_MAX + "줄까지 가능합니다.");
				return result;
			}
			
			if (maxCells > EXCEL_CELL_MAX) {
				result.put("status", "error");
				result.put("message", "엑셀파일은 " + EXCEL_CELL_MAX + "열까지 가능합니다.");
				return result;
			}
			
			result.put("status", "success");
			result.put("sheet", sheet);
			result.put("maxRows", maxRows);
			result.put("maxCells", maxCells);
			return result;
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
		}
		
		return result;
	}

	@Override
	public Map<String, Object> readExcelData(String excelFile, String sheetName) throws IOException {
		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();
		
		// 1. 파일 검증
		Map<String, Object> validation = validateExcelFile(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
		Sheet sheet = (Sheet) validation.get("sheet");
		int maxRows = (int) validation.get("maxRows");
		int maxCells = (int) validation.get("maxCells");
		
		// 2. 열번호 행 추가
		List<String> colHeaders = new ArrayList<>();
		for (int i = 0; i < maxCells; i++) {
			colHeaders.add(getColumnName(i));
		}
		data.add(colHeaders);
		
		// 3. 데이터 행 추가
		for (int r = 0; r < maxRows; r++) {
			Row row = sheet.getRow(r);
			List<String> rowData = new ArrayList<>();
			
			for (int c = 0; c < maxCells; c++) {
				String excelValue = "";
				if (row != null) {
					Cell cell = row.getCell(c);
					if (cell != null) {
						switch (cell.getCellType()) {
							case FORMULA:
								excelValue = cell.getCellFormula();
								break;
							case NUMERIC:
								excelValue = DateUtil.isCellDateFormatted(cell) ?  new SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue()) : String.valueOf((int) cell.getNumericCellValue());
								break;
							case STRING:
								excelValue = cell.getStringCellValue();
								break;
							case BLANK:
								excelValue = "";
								break;
							case BOOLEAN:
								excelValue = String.valueOf(cell.getBooleanCellValue());
								break;
							case ERROR:
								excelValue = String.valueOf(cell.getErrorCellValue());
								break;
								
							default:
								excelValue = "";
						}
					}
				}
				rowData.add(excelValue);
			}
			data.add(rowData);
		}
		
		result.put("status", "success");
		result.put("retData", data);
		
		return result;
	}
	
	/**
	 * 엑셀 열번호(A, B, C... AA, AB...)
	 */
	public static String getColumnName(int index) {
		StringBuilder columnName = new StringBuilder();
		
		while (index >= 0) {
			columnName.insert(0, (char) ('A' + (index % 26)));
			index = (index / 26) - 1;
		}
		
		return columnName.toString();
	}
	
	
	/**
	 * 엑셀 열 인덱스(문자열 → 숫자 변환)
	 */
	public static int getColumnNameToIndex(String colName) {
		
		return new CellReference(colName + "1").getCol(); // "B" → 1
	}
	
	public int getSMSLen(String str) {
		int iLength = 0;
		
		if (str != null && str.length() > 0) {
			try {
				// byte[] by = str.getBytes(); // UTF-8
				byte[] by = str.getBytes("EUC-KR");
				iLength = by.length;
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
	    
		return iLength;
	}
	
	public String checkStrLen(int messageLen, int titleLen, String callee, String callback, String messageType) {
		Pattern p = Pattern.compile("^[0-9]*$"); // 숫자만
		String result = "";
		
		int MAX_LEN = messageType.equals("sms") ? 80 : 2000; // 메시지 최대 길이
		Matcher m = p.matcher(callee);
		Matcher m2 = p.matcher(callback);
		
		// 매치되지 않을 경우
		if (!m.matches()) result = "수신번호 이상";
		else if (!m2.matches()) result = "발신번호 이상";
		else if (messageLen == 0) result = "메시지 비어있음";
		else if (messageLen > MAX_LEN) result = "메시지길이 초과";
		else result = "발송가능";
		
		if (callee.equals("")) result = "수신번호 이상";
		if (callback.equals("")) result = "발신번호 이상";
		
		if (!messageType.equals("sms")) {
			if (titleLen > 200) result = "제목길이 초과";
			else if (titleLen == 0) result = "제목 없음";
		}
		
		return result;
	}
	
	public String applyTranNum(String flag, String colLetters, String directValue, List<String> row) {
		// 직접입력
		if ("1".equals(flag)) return directValue == null ? "" : directValue;
		if (!"2".equals(flag)) return ""; // 그 외
		
		// 열선택
		int idx = getColumnNameToIndex(colLetters);
		if (idx >= 0 && idx < row.size()) return row.get(idx) == null ? "" : row.get(idx);
		
		return "";
	}
	
	public String applyMessage(String template, List<String> row) {
		if (template == null) return "";
		String msg = template;
		
		for (int c = 0; c < row.size(); c++) {
			String token = "[%" + getColumnName(c) + "%]"; //열변수
			String val = row.get(c) == null ? "" : row.get(c);
			msg = msg.replace(token, val);
		}
		
		return msg;
	}
}
