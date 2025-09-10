package com.web.gmarket.bulk.db.controller;

import java.io.File;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.service.DbSendService;

@RestController
@RequestMapping("/api/v1/dbSend")
public class RestDbSendController {
	private final DbSendService dbSendService;
	
	public RestDbSendController(DbSendService dbSendService) {
		this.dbSendService = dbSendService;
	}
	
	@PostMapping("/list")
	public void list() {
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	//요청번호 조회
	@PostMapping("/search")
	public ResponseEntity<?> getDbSendList(@RequestBody DbSendDto dbSendDto) {
		try {
			List<DbSendDto> result = dbSendService.getDbSendList(dbSendDto);
			int totalCount = dbSendService.getDbSendCount(dbSendDto);
			
			Map<String, Object> response = new HashMap<>();
			response.put("data", result);
			response.put("totalCount", totalCount);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
			
			Map<String, Object> error = new HashMap<>();
			error.put("message", "요청번호 조회 실패");
			error.put("error", e.getMessage());
			
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
	
	//요청번호 삭제
	@DeleteMapping("/delete")
	public ResponseEntity<?> delete(@RequestBody DbSendDto dbSendDto) {
		try {
			Map<String, Object> response = new HashMap<>();
			
			int deletedCount = dbSendService.deleteDbSend(dbSendDto);
			
			if (deletedCount > 0) {
				response.put("status", "success");
				response.put("message", "삭제 성공");
				return ResponseEntity.ok(response);
				
			} else {
				response.put("status", "fail");
				
				if (dbSendDto.getReserved4() == null) {
					response.put("message", "잘못된 요청 (필수 값 없음)");
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 400
				} else {
					response.put("message", "삭제 대상 없음");
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // 404
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			
			Map<String, Object> error = new HashMap<>();
			error.put("status", "error");
			error.put("message", "요청번호 삭제 실패");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@PostMapping("/fileUpload")
	public ResponseEntity<?> uploadFile(
			@RequestParam("files[]") List<MultipartFile> files,
			@RequestParam(value = "imgNumFlag", required = false) String imgNumFlag,
			@RequestParam(value = "fileName1", required = false) String fileName1,
			@RequestParam(value = "fileName2", required = false) String fileName2) {

		try {
			if (files == null || files.isEmpty()) {
				return ResponseEntity.badRequest().body("업로드할 파일이 없습니다.");
			}

			// 오늘 날짜
			LocalDate today = LocalDate.now();
			String folderMonth = today.format(DateTimeFormatter.ofPattern("yyyyMM"));   // 202509
			String folderDate = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));  // 20250910

			// 폴더 경로
			String path = "C:/excel_web/img/db/";

			Path monthPath = Paths.get(path, folderMonth);
			Path datePath  = Paths.get(monthPath.toString(), folderDate);
			// Path basePath = Paths.get("C:/upload");
			// Path monthPath = basePath.resolve(folderMonth);  // C:/upload/202509
			// Path datePath = monthPath.resolve(folderDate);   // C:/upload/202509/20250910

			// 폴더 없으면 생성
			if (!Files.exists(datePath)) {
				Files.createDirectories(datePath);
			}

			// 파일 저장
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					String originalFileName = file.getOriginalFilename();
					Path filePath = datePath.resolve(originalFileName); // C:/upload/202509/20250910/파일명
					Files.write(filePath, file.getBytes());
				}
			}

			// DB에 저장하는 로직 추가 가능
			// dbSendService.saveImage(imgNumFlag, fileName1, fileName2);

			return ResponseEntity.ok("업로드 성공: " + files.size() + "개 파일");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body("업로드 실패: " + e.getMessage());
		}
	}


	// @PostMapping("/fileUpload")
	// public ResponseEntity<?> uploadFile(
	// 		@RequestParam("files[]") List<MultipartFile> files,
	// 		@RequestParam(value = "imgNumFlag", required = false) String imgNumFlag,
	// 		@RequestParam(value = "fileName1", required = false) String fileName1,
	// 		@RequestParam(value = "fileName2", required = false) String fileName2) {

	// 	try {
	// 		if (files == null || files.isEmpty()) {
	// 			return ResponseEntity.badRequest().body("업로드할 파일이 없습니다.");
	// 		}

	// 		for (MultipartFile file : files) {
	// 			String originalFileName = file.getOriginalFilename();
	// 			Path path = Paths.get("C:/upload/" + originalFileName);
	// 			Files.write(path, file.getBytes());
	// 		}

	// 		return ResponseEntity.ok("업로드 성공: " + files.size() + "개 파일");
	// 	} catch (Exception e) {
	// 		e.printStackTrace();
	// 		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	// 							.body("업로드 실패: " + e.getMessage());
	// 	}
	// }

}