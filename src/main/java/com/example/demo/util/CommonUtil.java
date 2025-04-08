package com.example.demo.util;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonUtil {

	 /**
	  * null 치환
	  * @param val
	  * @return
	  */
	 public static String nvl(Object val){
		 return CommonUtil.nvl(val,"");
	 }

	 /**
	  * null 치환
	  * @param val
	  * @param repVal
	  * @return
	  */
	 public static String nvl(Object val,String repVal){
		String result = "";
		if(val != null)
		{
			result = String.valueOf(val);
			if(result.length() == 0)
			{
				result = repVal;
			}
		}
		else
		{
			result = repVal;
		}
	    return result;
	 }

	/**
	 * 
	 * @param value
	 * @return
	 */
	public static boolean isCamelCase(String value){
		if(value != null){
			String camelCasePattern = "([a-z]+[A-Z]+\\w+)+"; // 3rd edit, getting better
			return value.matches(camelCasePattern);
		}else {
			return true;
		}
	}
	
	/**
	 * 빈값체크
	 * @param value
	 * @return
	 */
	public static boolean isEmpty(Object value) {
		String chkVal = CommonUtil.nvl(value);
		if("".equalsIgnoreCase(chkVal)) {
			return true;
		}else {
			return false;
		} 
	}
	

	/**
	 *
	 * @param value
	 * @return
	 */
	public static String escapeHtml(String value){
		String result = CommonUtil.nvl(value);
		if(!"".equalsIgnoreCase(result)){
			result = result.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");
		}
		return result;
	}

	public static String convertToDateTime(String date, boolean isStartDate) {
		String dateTime = "";
		if (isStartDate) {
			dateTime = String.format("%s-%s-%s 00:00:00",date.substring(0,4), date.substring(4,6), date.substring(6,8));
		} else {
			dateTime = String.format("%s-%s-%s 23:59:59",date.substring(0,4), date.substring(4,6), date.substring(6,8));
		}
		return dateTime;
	}

	public static String toUnderscore(String str) {
		 return CommonUtil.nvl(str.replaceAll("([a-z])([A-Z])", "$1_$2")
                 .replaceAll("([A-Z])([A-Z][a-z])", "$1_$2")
                 .toLowerCase());
	}
	
	public static String toCamelCase(String str) {
		String[] parts = CommonUtil.nvl(str).split("_");
		if(parts.length > 0) {
	        StringBuilder result = new StringBuilder();
	        for (String part : parts) {
	            if (part.length() > 0) {
	                result.append(Character.toUpperCase(part.charAt(0)));
	                result.append(part.substring(1).toLowerCase());
	            }
	        }
	        return result.toString();
		}else {
			return str;
		}
	}

	public static Map<String,Object> mapKeyConverter(Map<String,Object> map, String type) {
		Map<String,Object> nMap = new HashMap<String,Object>();
		if(map != null){
			Iterator<String> iter = map.keySet().iterator();
			while(iter.hasNext()) {
				String key = iter.next();
				String reKey = "";
				if("US".equalsIgnoreCase(type)){ //UNDER_SCORE
					reKey = toUnderscore(key);
				}else if("CM".equalsIgnoreCase(type)){ //CAMEL_CASE
					reKey = toCamelCase(key);
				}
				Object obj = map.get(key);
				if (obj instanceof Map) {
					nMap.put(reKey, mapKeyConverter((Map<String,Object>)obj,type));
				}else{
					nMap.put(reKey, obj);
				}

			}
		}
		return nMap;
	}

	public static int getByte(String txt) {
		try {
			return escapeHtml(nvl(txt)).getBytes("euc-kr").length;
		} catch (UnsupportedEncodingException e) {
			return 0;
		}
	}

	public static String getMsgType(String txt) {
		int bt = getByte(txt);
		String msgType = "SMS";
		if(bt <= 90) {
			msgType = "SMS";
		} else if(90 < bt && bt <= 1990) {
			msgType = "LMS";
		}
		return msgType;
	}
	
	public static boolean isEmoji(String message) {
		if(message != null) {
			Pattern emojiPattern = Pattern.compile("[\\x{1F600}-\\x{1F64F}]");
			Matcher matcher = emojiPattern.matcher(message);
			return matcher.find();
		}
		return false;
	}
}