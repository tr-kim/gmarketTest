package com.web.gmarket.common.utils;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

public class ValidateHandingUtils {

	public static final ResponseEntity<?> validateHandling(Errors errors) {
		
		Map<String, Object> result = new HashMap<>();
		
		LinkedHashMap<String, String> validatorResult = new LinkedHashMap<>();
		
		if (errors.hasErrors()) {
			
			for (FieldError error : errors.getFieldErrors()) {
				String validKeyName = String.format("valid_%s", error.getField());
				validatorResult.put(validKeyName, error.getDefaultMessage());
			}
			
			for (String key : validatorResult.keySet()) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.VALIDATE_ERROR);
				result.put(ConstantsUtils.RESULT, validatorResult.get(key));
				break;
			}

			return ResponseEntity.status(HttpStatus.OK).body(result);
		}
		
		return null;
	}
}
