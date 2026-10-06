package com.example.java_ecommerce.dto;

import java.util.Map;

public class ValidExceptionDto {
    private boolean success = false;
    private String message;
    private Integer StatusCode;
    private Long timestamp;
    private String path;
    private Map<String, String> error;
    public ValidExceptionDto(){};
    public boolean isSuccess(){
        return success;
    }
    public void setSuccess(boolean success){
        this.success=success;
    }
    public String getMessage(){
        return message;
    }
    public void setMessage(String message){
        this.message=message;
    }
    public Integer getStatusCode(){
        return StatusCode;
    }
    public void setStatusCode(Integer StatusCode){
        this.StatusCode=StatusCode;
    }
    public Long getTimestamp(){
        return timestamp;
    }
    public void setTimestamp(Long timestamp){
        this.timestamp=timestamp;
    }
    public String getPath(){
        return path;
    }
    public void setPath(String path){
        this.path=path;
    }
    public Map<String, String> getError(){
        return error;
    }
    public void setError(Map<String, String> error){
        this.error=error;
    }
}
