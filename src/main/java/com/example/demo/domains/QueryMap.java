package com.example.demo.domains;

import com.example.demo.util.CommonUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.type.Alias;
import org.springframework.jdbc.support.JdbcUtils;

import java.util.HashMap;


@Alias("QueryMap")
@Slf4j
public class QueryMap extends HashMap<String, Object>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * MyBatis resultType에 사용  CamelCase 로 변환 해준다.
	 */
	public Object put(String key , Object value){
		if(!CommonUtil.isCamelCase(key)){
			key = JdbcUtils.convertUnderscoreNameToPropertyName(key);
		}
		//log.info("{} ================> {}" ,key , value);
		return super.put(key, value);
	}
}

