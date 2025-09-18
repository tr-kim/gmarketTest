package com.web.gmarket.common.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.SocketException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.springframework.beans.factory.annotation.Autowired;

import com.web.gmarket.common.config.FtpProperties;
import com.web.gmarket.common.vo.FtpDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FtpUtils {
	
	@Autowired
	private static FtpProperties ftpProperties;
	
    /**
     * FTP 연결 생성
     */
    public static FTPClient createConnection(Integer code, String type) throws SocketException, IOException {
    	
    	FTPClient ftpClient = new FTPClient();
    	
        try {
        	
        	// Auction, Gmarket 유형 확인 후 정보 설정
            ftpProperties.getProperties(code, type);
            
            // 연결
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 연결 시도");
            ftpClient.connect(ftpProperties.getHost(), ftpProperties.getPort());
            
            int reply = ftpClient.getReplyCode();
            
            if (!FTPReply.isPositiveCompletion(reply)) {
            	ftpClient.disconnect();
            	log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 연결 실패");
            } else {
            	// 타임아웃 설정
                ftpClient.setConnectTimeout(ftpProperties.getConnectionTimeout());
            }
            
            // 로그인
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 로그인 시도 시도");
            ftpClient.login(ftpProperties.getUsername(), ftpProperties.getPassword());
            
//            log.info(String.format("%s%s", "서버 정보: ", ftpProperties.getHost()));
            
            // 현재 작업 디렉토리 변경
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 현재 작업 디렉토리: {}", ftpClient.printWorkingDirectory());
            ftpClient.changeWorkingDirectory(ftpProperties.getPath());
            log.info( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 이동된 작업 디렉토리: {}", ftpClient.printWorkingDirectory());
            
            Calendar c = Calendar.getInstance();
            String makeDirectory = String.format("%s%s", String.valueOf(c.get(Calendar.YEAR)), "0" + String.valueOf(c.get(Calendar.MONTH) + 1));
            
            ftpClient.makeDirectory(makeDirectory);
            ftpClient.changeWorkingDirectory(String.format("%s%s", ftpProperties.getPath(), makeDirectory));	// 디렉토리 생성 후 디렉토리로 이동
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 업로드 디렉토리: {}", ftpClient.printWorkingDirectory());
            
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 작업 완료: {}", ftpClient.getReplyString());
           
        } catch (SocketException e) {
        	e.printStackTrace();
        	throw new SocketException(String.format("%s%s", ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 소캣 에러 발생 ", e));
        } catch (IOException e) {
        	e.printStackTrace();
            throw new IOException(String.format("%s%s", ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 에러 발생 ", e));
        } finally {
        	closeConnection(ftpClient);
		}
        
        return ftpClient;
    }
    
    /**
     * 파일 업로드
     * @throws IOException 
     */
    public static void uploadFile(FTPClient ftpClient, FtpDto dto) throws IOException, IllegalArgumentException {
    	
    	FileInputStream fileInput1 = null;
    	FileInputStream fileInput2 = null;
    	
    	// Auction, Gmarket 유형 확인 후 정보 설정
        ftpProperties.getProperties(dto.getLargeCategory(), dto.getMsgType());
        
        try {
        	
        	// 날짜 생성
        	LocalDateTime now = LocalDateTime.now();
        	
        	// 날짜 포맷 변환
        	DateTimeFormatter sfMonth = DateTimeFormatter.ofPattern("yyyyMM");
        	DateTimeFormatter sfDate = DateTimeFormatter.ofPattern("yyyyMMdd");
        	
        	String month = now.format(sfMonth);
        	String date = now.format(sfDate);
        	
        	log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Month : {}", month);
        	log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Date : {}", date);
        	
        	// 업로드 경로 설정
        	String uploadPath = String.format("%s\\%s\\%s", ConstantsUtils.EXCEL_IMAGE_PATH, month, date);
        	log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> UploadPath : {}", uploadPath);
        	
        	String imageName1 = dto.getImageName01();
        	String imageName2 = dto.getImageName02();
        	
        	log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Image Path 01 : {}", imageName1);
        	log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Image Path 02 : {}", imageName2);
        	
        	String windowPath = ftpProperties.getWindowPath();
        	String ftpPath = ftpProperties.getPath();
        	
        	if(!StringUtils.isBlank(imageName1) && !StringUtils.isBlank(imageName2)) {
        		File uploadFile1 = new File(String.format("%s\\%s", uploadPath, imageName1));
        		File uploadFile2 = new File(String.format("%s\\%s", uploadPath, imageName2));
        		
        		fileInput1 =  new FileInputStream(uploadFile1);
        		fileInput2 =  new FileInputStream(uploadFile2);
        		
        		boolean isSuccess1 = ftpClient.storeFile(uploadFile1.getName(), fileInput1);
        		boolean isSuccess2 = ftpClient.storeFile(uploadFile1.getName(), fileInput2);
        		
        		if (isSuccess1) log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Upload Success Image1");
        		if (isSuccess2) log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Upload Success Image2");
        		
        		// 이미지 경로 저장
            	dto.setImagePath01(String.format("%s%s%s/%s", windowPath, ftpPath, month, imageName1));
            	dto.setImagePath02(String.format("%s%s%s/%s", windowPath, ftpPath, month, imageName2));
        		
        	} else if(!StringUtils.isBlank(imageName1)) {
        		File uploadFile = new File(String.format("%s\\%s", uploadPath, imageName1));
        		fileInput1 =  new FileInputStream(uploadFile);
        		
        		boolean isSuccess = ftpClient.storeFile(uploadFile.getName(), fileInput1);
        		
        		if (isSuccess) log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Upload Success Image1");
        		
        		// 이미지 경로 저장
            	dto.setImagePath01(String.format("%s%s%s/%s", windowPath, ftpPath, month, imageName1));
        		
        	} else if(!StringUtils.isBlank(imageName2)) {
        		
        		File uploadFile = new File(String.format("%s\\%s", uploadPath, imageName2));
        		fileInput2 =  new FileInputStream(uploadFile);
        		
        		boolean isSuccess = ftpClient.storeFile(uploadFile.getName(), fileInput2);
        		
        		if (isSuccess) log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Upload Success Image2");
        		
        		// 이미지 경로 저장
            	dto.setImagePath02(String.format("%s%s%s/%s", windowPath, ftpPath, month, imageName2));
            	
        	} else {
        		throw new IllegalArgumentException("이미지 파일 이름이 존재하지 않습니다.");
        	}
            
        } catch (IllegalArgumentException e) {
        	e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage(), e);
        } catch (IOException e) {
        	e.printStackTrace();
            throw new IOException("파일 업로드 중 오류 발생", e);
        } finally {
        	
        	if(fileInput1 != null) {
        		fileInput1.close();
        	}
        	
        	if(fileInput2 != null) {
        		fileInput2.close();
        	}
        }
    }
    
    /**
     * 연결 종료
     */
    public static void closeConnection(FTPClient ftpClient) {
        if (ftpClient != null && ftpClient.isConnected()) {
            try {
                ftpClient.logout();
                ftpClient.disconnect();
                log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 연결 종료");
            } catch (IOException e) {
                log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> FTP 연결 종료 중 오류: {}", e);
            }
        }
    }
}
