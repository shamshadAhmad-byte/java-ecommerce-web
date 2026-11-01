package com.example.java_ecommerce.dto;

public class ExceptionResDto {
    private boolean success = false;
    private String message;
    private Integer StatusCode;
    private Long timestamp;
    private String path;
    private String error;
    public ExceptionResDto(){};
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
    public String getError(){
        return error;
    }
    public static class Builder {
        private final ExceptionResDto exceptionResDto;

        public Builder() {
            this.exceptionResDto = new ExceptionResDto();
        }

        public Builder withSuccess(boolean success) {
            exceptionResDto.success = success;
            return this;
        }

        public Builder withMessage(String message) {
            exceptionResDto.message = message;
            return this;
        }

        public Builder withStatusCode(Integer statusCode) {
            exceptionResDto.StatusCode = statusCode;
            return this;
        }

        public Builder withTimestamp(Long timestamp) {
            exceptionResDto.timestamp = timestamp;
            return this;
        }

        public Builder withPath(String path) {
            exceptionResDto.path = path;
            return this;
        }

        public Builder withError(String error) {
            exceptionResDto.error = error;
            return this;
        }

        public ExceptionResDto build() {
            return exceptionResDto;
        }
    }
}
