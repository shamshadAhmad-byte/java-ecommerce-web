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
    public String getMessage(){
        return message;
    }
    public Integer getStatusCode(){
        return StatusCode;
    }
    public Long getTimestamp(){
        return timestamp;
    }
    public String getPath(){
        return path;
    }
    public Map<String, String> getError(){
        return error;
    }
    public static class Builder{
        private final ValidExceptionDto validExceptionDto;
        public Builder(){
            validExceptionDto=new ValidExceptionDto();
        }
        public Builder withSuccess(boolean success){
            validExceptionDto.success=success;
            return this;
        }
        public Builder withMessage(String message){
            validExceptionDto.message=message;
            return this;
        }
        public Builder withStatusCode(Integer StatusCode){
            validExceptionDto.StatusCode=StatusCode;
            return this;
        }
        public Builder withTimestamp(Long timestamp){
            validExceptionDto.timestamp=timestamp;
            return this;
        }
        public Builder withPath(String path){
            validExceptionDto.path=path;
            return this;
        }
        public Builder withError(Map<String, String> error){
            validExceptionDto.error=error;
            return this;
        }
        public ValidExceptionDto build(){
            return validExceptionDto;
        }
    }
}
