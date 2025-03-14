package com.example.demo.common.data;

import com.example.demo.common.enums.ApiResultEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Data
@JsonInclude(Include.NON_NULL)
public class ResultData {
	
	private ApiResultEnum code;
	
	private String message;
	
	private Map<String,?> data;
	
	private List<?> list;	
	
	private Map<String,Object> page;
	
	public ResultData(ApiResultEnum code) {
		this.code = code;
	}
	
	public ResultData(ApiResultEnum code, String message) {
		this.code = code;
		this.message = message;
	}
	
	public ResultData(ApiResultEnum code, Map<String, ?> data) {
		this.code = code;
		this.data = data;
	}
	
	public ResultData(ApiResultEnum code, List<?> list) {
		this.code = code;
		this.list = list;
	}
}
