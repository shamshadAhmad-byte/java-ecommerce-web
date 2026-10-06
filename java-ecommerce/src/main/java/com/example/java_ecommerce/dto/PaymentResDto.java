package com.example.java_ecommerce.dto;

public class PaymentResDto {
    private boolean success;
    private String paymentMethod;
    private String paymentStatus;
    private String sessionUrl;
    private String sessionId;
    private String message;

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    public String getSessionUrl() {
        return sessionUrl;
    }
    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }
    public String getSessionId() {
        return sessionId;
    }
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public PaymentResDto() {}
    public static class Builder{
        private final PaymentResDto paymentResDto;
        public Builder(){
            paymentResDto = new PaymentResDto();
        }
        public Builder withSuccess(boolean success){
            paymentResDto.success = success;
            return this;
        }
        public Builder withPaymentMethod(String paymentMethod){
            paymentResDto.paymentMethod=paymentMethod;
            return this;
        }
        public Builder withPaymentStatus(String paymentStatus){
            paymentResDto.paymentStatus=paymentStatus;
            return this;
        }
        public Builder withSessionUrl(String sessionUrl){
            paymentResDto.sessionUrl=sessionUrl;
            return this;
        }
        public Builder withSessionId(String sessionId){
            paymentResDto.sessionId=sessionId;
            return this;
        }
        public Builder withMessage(String message){
            paymentResDto.message=message;
            return this;
        }
        public PaymentResDto build(){
            return paymentResDto;
        }
    }
}
