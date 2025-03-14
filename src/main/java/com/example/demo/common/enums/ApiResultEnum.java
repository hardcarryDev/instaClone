package com.example.demo.common.enums;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum ApiResultEnum {
	
	SUCCESS("SUCCESS"),
	ERROR("ERROR");
	
	private String message;
	
	ApiResultEnum(String message) {
		this.message = message;
	}
	
	private static Map<String,ApiResultEnum> map = new HashMap<>();
	static {
		for(ApiResultEnum apiResult : values()) {
			map.put(apiResult.name(), apiResult);
		}
	}
	
	public static ApiResultEnum find(String message) {
		ApiResultEnum apiResult = map.get(message);
		if(apiResult == null) {
			apiResult = ApiResultEnum.SUCCESS;
		}
		return apiResult;
	}
}
