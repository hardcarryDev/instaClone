package com.example.demo.common.exception;


public class ApiException extends RuntimeException {

	private static final long serialVersionUID = -5185223516003229079L;

	
	public ApiException() {
        super();
    }

    public ApiException(String message) {
        super(message);
    }
    
    public ApiException(String message, Throwable cause) {
        super(message);
    }
    
    public ApiException(Throwable cause) {
        super(cause);
    }
    
    protected ApiException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
