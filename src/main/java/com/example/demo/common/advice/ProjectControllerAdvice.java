package com.example.demo.common.advice;
import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class ProjectControllerAdvice {
    @ExceptionHandler
    public ResponseEntity<ResultData> handleException(final Exception ex, final HttpServletRequest request) {
        log.error("Request URI: {}", request.getRequestURI());
        log.error(ex.getMessage(), ex);

        ResultData  errorEntity = new ResultData(ApiResultEnum.ERROR, ex.getMessage());
        return new ResponseEntity<ResultData>(errorEntity, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
