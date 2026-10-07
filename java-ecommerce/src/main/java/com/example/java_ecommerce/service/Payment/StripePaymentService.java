package com.example.java_ecommerce.service.Payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.java_ecommerce.dto.PaymentResDto;
import com.example.java_ecommerce.entity.Order;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;

@Service("stripe")
public class StripePaymentService implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.currency:usd}")
    private String currency;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentResDto payment(Order order) {

        try {
            Stripe.apiKey = stripeApiKey;
            Long unitAmount = Math.round(order.getTotalAmount() * 100);

            SessionCreateParams.LineItem params = SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(currency.toLowerCase())
                                    .setUnitAmount(unitAmount)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName("Order #" + (order.getId() != null ? order.getId() : "New")
                                                            + " - " + (order.getCustomerName() != null ? order.getCustomerName() : "Customer"))
                                                    .setDescription("Payment for order #" + (order.getId() != null ? order.getId() : "New"))
                                                    .build()
                                    ).build()
                    ).build();

            String effectiveSuccessUrl = (order.getSuccessUrl() != null && !order.getSuccessUrl().trim().isEmpty())
                    ? order.getSuccessUrl()
                    : this.successUrl;
            String effectiveCancelUrl = (order.getCancelUrl() != null && !order.getCancelUrl().trim().isEmpty())
                    ? order.getCancelUrl()
                    : this.cancelUrl;

            SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .addLineItem(params)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(effectiveSuccessUrl)
                    .setCancelUrl(effectiveCancelUrl)
                    .putMetadata("order_id", String.valueOf(order.getId()));

                    if (order.getCustomerEmail() != null && !order.getCustomerEmail().trim().isEmpty()) {
                paramsBuilder.setCustomerEmail(order.getCustomerEmail());
            }

            Session session = Session.create(paramsBuilder.build());

            order.setPaymentMethod("stripe");
            order.setPaymentStatus("PAYMENT_PENDING");
            order.setStatus("PENDING");
            order.setStripeSessionId(session.getId());
            PaymentResDto paymentResponse = new PaymentResDto();
            paymentResponse.setSuccess(true);
            paymentResponse.setSessionId(session.getId());
            paymentResponse.setSessionUrl(session.getUrl());
            paymentResponse.setMessage("Stripe checkout session created successfully");
            return paymentResponse;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe checkout session: " + e.getMessage(), e);
        }
    }
    public boolean verifySession(String sessionId) {
        try {
            Stripe.apiKey = stripeApiKey;
            Session session = Session.retrieve(sessionId);
            return "paid".equalsIgnoreCase(session.getPaymentStatus());
        } catch (StripeException e) {
            throw new RuntimeException("Error verifying Stripe session: " + e.getMessage(), e);
        }
    }

    public Event constructWebhookEvent(String payload, String sigHeader) {
        try {
            return Webhook.constructEvent(payload, sigHeader, this.webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Invalid Stripe signature: " + e.getMessage(), e);
        }
    }

}
