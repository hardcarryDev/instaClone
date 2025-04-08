package com.example.demo.util;

import com.example.demo.common.data.ResultData;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
public class RequestUtil {

   /**
    * HttpServletReqeust 객체를 직접 얻습니다.
    * @return
    */
   public static HttpServletRequest getRequest() {
	   HttpServletRequest req = null;
	   try {
	       ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();	       
	       if(attr != null){
	    	   req =  attr.getRequest(); 
	       }
	   }catch(IllegalStateException e) {
		   log.info("REQUEST => NULL");
	   }
       
	   return req;
   }
   
   public static HttpServletResponse getResponse() {
	   HttpServletResponse res = null;
	   try {
	       ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();	       
	       if(attr != null){
	    	   res =  attr.getResponse(); 
	       }
	   }catch(IllegalStateException e) {
		   log.info("RESPONSE => NULL");
	   }
       
	   return res;
   }
   
	public static boolean isAjax(HttpServletRequest req) {
		String xHeader = req.getHeader("x-requested-with");
		if("XMLHttpRequest".equalsIgnoreCase(xHeader)){
			return true;
		}
		return false;
	}
	
	public static String getIp() {
		HttpServletRequest req = getRequest();
		return getIp(req);
	}
	
	public static String getIp(HttpServletRequest req) {
		String ip = "";
		if(req != null) {
			String[] headers = new String[] {"X-Forwarded-For","Proxy-Client-IP","WL-Proxy-Client-IP","HTTP_CLIENT_IP","HTTP_X_FORWARDED_FOR"};
			for(String headr : headers) {
				ip = CommonUtil.nvl(req.getHeader(headr));
				if(!"".equalsIgnoreCase(ip) && !"unknown".equalsIgnoreCase(ip)) {
					break;
				}
			}
			if("".equalsIgnoreCase(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = req.getRemoteAddr();
			}
		}
		return ip;
	}
	
	
	public static String getHostName() {
		HttpServletRequest req = getRequest();
		return getHostName(req);
	}
	

	public static String getHostName(HttpServletRequest req) {
		StringBuffer sb  = new StringBuffer();
		if(req != null) {
			sb.append(req.getScheme())
			  .append("://")
			  .append(req.getServerName())
			  .append(":")
			  .append(req.getServerPort());
		}
		return sb.toString();
	}
	
	public static void error(HttpServletRequest req, HttpServletResponse res, ResultData rslt) {
		error(req,res,rslt,null);
	}
	
	public static void error(HttpServletRequest req,HttpServletResponse res,ResultData rslt,String redirect) {
		try {
			if(RequestUtil.isAjax(req)) {
				res.setContentType(MediaType.APPLICATION_JSON_VALUE);
		        res.setStatus(HttpStatus.UNAUTHORIZED.value());
		        res.setCharacterEncoding("UTF-8");
		        byte[] jsonBytes = ObjectUtil.toJson(rslt).getBytes(StandardCharsets.UTF_8);
		        res.getOutputStream().write(jsonBytes);
		        //res.getWriter().write(ObjectUtil.toJson(ObjectUtil.toJson(rslt)));
			}else {
				RequestDispatcher dispt = req.getRequestDispatcher(redirect);
				dispt.forward(req, res);
			}
		} catch (ServletException | IOException e) {
			if(e.getCause() != null) {
				log.error("ERROR : {}",e.getCause().getMessage());
			}else {
				log.error("ERROR : {}",e.getMessage());	
			}
		}
	}
}
