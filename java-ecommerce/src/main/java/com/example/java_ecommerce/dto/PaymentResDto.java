package com.example.java_ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class PaymentResDto {
    private boolean success;
    private String paymentMethod;
    private String paymentStatus;
    private String sessionUrl;
    private String sessionId;
    private String message;

    public PaymentResDto() {}
    public boolean isSuccess() {
        return success;
    }
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
