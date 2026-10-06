package com.example.java_ecommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.java_ecommerce.dto.AddressDto;
import com.example.java_ecommerce.dto.OrderItemDto;
import com.example.java_ecommerce.dto.OrderReqDto;
import com.example.java_ecommerce.dto.OrderResDto;
import com.example.java_ecommerce.dto.PaymentResDto;
import com.example.java_ecommerce.entity.Address;
import com.example.java_ecommerce.entity.Order;
import com.example.java_ecommerce.entity.OrderItem;
import com.example.java_ecommerce.entity.Product;
import com.example.java_ecommerce.entity.User;
import com.example.java_ecommerce.exception.ResourceNotFoundException;
import com.example.java_ecommerce.exception.UserNotAuthorizeException;
import com.example.java_ecommerce.repository.OrderRepository;
import com.example.java_ecommerce.repository.ProductRepository;
import com.example.java_ecommerce.repository.UserRepository;
import com.example.java_ecommerce.service.Payment.PaymentFactoryService;
import com.example.java_ecommerce.service.Payment.PaymentService;
import com.example.java_ecommerce.service.Payment.StripePaymentService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentFactoryService paymentFactory;
    private final StripePaymentService stripePaymentService;

    public OrderService(OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            PaymentFactoryService paymentFactory,
            StripePaymentService stripePaymentService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.paymentFactory = paymentFactory;
        this.stripePaymentService = stripePaymentService;
    }

    public OrderResDto createOrder(OrderReqDto orderReqDto, String userEmail) throws UserNotAuthorizeException {
        if (userEmail == null || userEmail.isBlank()) {
            throw new UserNotAuthorizeException("User must be authenticated to place an order");
        }

        Order order = handleMultipleOrder(orderReqDto, userEmail);

        PaymentService paymentService = paymentFactory.getPaymentService(orderReqDto.getPaymentMethod());
        PaymentResDto paymentRes = paymentService.payment(order);
        order = orderRepository.save(order);

        OrderResDto resDto = mapOrderToResDto(order);
        resDto.setSessionUrl(paymentRes.getSessionUrl());
        resDto.setMessage(paymentRes.getMessage());
        return resDto;
    }

    @Transactional(readOnly = true)
    public OrderResDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapOrderToResDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResDto> getUserOrders(String email) {
        if (email == null || email.isBlank()) {
            throw new UserNotAuthorizeException("User must be authenticated to view orders");
        }
        List<Order> orders = orderRepository.findByCustomerEmail(email);
        return orders.stream().map(this::mapOrderToResDto).collect(Collectors.toList());
    }

    public OrderResDto verifyStripePayment(String sessionId) {
        Order order = orderRepository.findByStripeSessionId(sessionId).orElseThrow(()
                -> new ResourceNotFoundException("Order not found for Stripe session: " + sessionId));

        boolean isPaid = stripePaymentService.verifySession(sessionId);
        if (isPaid) {
            order.setPaymentStatus("COMPLETED");
            order.setStatus("CONFIRMED");
            order = orderRepository.save(order);
        } else if (!"COMPLETED".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("FAILED");
            order = orderRepository.save(order);
        }

        OrderResDto resDto = mapOrderToResDto(order);
        resDto.setSuccess(isPaid);
        resDto.setMessage(isPaid ? "Payment verified successfully" : "Payment verification failed or pending");
        return resDto;
    }

    public void handleStripeWebhook(String payload, String sigHeader) {
        Event event = stripePaymentService.constructWebhookEvent(payload, sigHeader);

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = null;
            if (event.getDataObjectDeserializer().getObject().isPresent()) {
                Object obj = event.getDataObjectDeserializer().getObject().get();
                if (obj instanceof Session s) {
                    session = s;
                }
            } else {
                try {
                    Object obj = event.getDataObjectDeserializer().deserializeUnsafe();
                    if (obj instanceof Session s) {
                        session = s;
                    }
                } catch (Exception ignored) {
                    // Ignore webhook payloads that cannot be deserialized.
                }
            }

            if (session != null) {
                final Session finalSession = session;
                orderRepository.findByStripeSessionId(finalSession.getId()).ifPresentOrElse(order -> {
                    order.setPaymentStatus("COMPLETED");
                    order.setStatus("CONFIRMED");
                    orderRepository.save(order);
                }, () -> {
                    if (finalSession.getMetadata() != null && finalSession.getMetadata().containsKey("order_id")) {
                        try {
                            Long orderId = Long.parseLong(finalSession.getMetadata().get("order_id"));
                            orderRepository.findById(orderId).ifPresent(order -> {
                                order.setStripeSessionId(finalSession.getId());
                                order.setPaymentStatus("COMPLETED");
                                order.setStatus("CONFIRMED");
                                orderRepository.save(order);
                            });
                        } catch (NumberFormatException ignored) {
                        }
                    }
                });
            }
        }
    }

    private Address mapAddressDtoToEntity(AddressDto dto) {
        Address address = new Address();
        address.setFirstName(dto.getFirstName());
        address.setLastName(dto.getLastName());
        address.setEmail(dto.getEmail());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        address.setPhone(dto.getPhone());
        return address;
    }

    private OrderResDto mapOrderToResDto(Order order) {
        OrderResDto dto = new OrderResDto();
        dto.setSuccess(true);
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        if (order.getItems() != null) {
            dto.setProductId(order.getItems().stream().map(OrderItem::getProductId).collect(Collectors.toList()));
            dto.setItems(order.getItems());
        }
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setStripeSessionId(order.getStripeSessionId());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    private Order handleMultipleOrder(OrderReqDto orderReqDto, String userEmail) {
        List<OrderItemDto> itemDtos = orderReqDto.getOrderItemDtos();
        if (itemDtos == null || itemDtos.isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be null or empty");
        }

        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new ResourceNotFoundException("User with email " + userEmail + " not found");
        }

        Order order = new Order();
        order.setCustomerEmail(userEmail);
        order.setCustomerName(user.getName());
        if (orderReqDto.getShippingAddress() != null) {
            Address address = mapAddressDtoToEntity(orderReqDto.getShippingAddress());
            order.setShippingAddress(address);
            order.setCustomerPhone(address.getPhone());
        }

        double calculatedTotal = 0.0;
        for (OrderItemDto itemDto : itemDtos) {
            if (itemDto == null || itemDto.getProductId() == null) {
                throw new IllegalArgumentException("Product ID is required in order items");
            }
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product with id " + itemDto.getProductId() + " not found"));
            int qty = itemDto.getQuantity() != null && itemDto.getQuantity() > 0 ? itemDto.getQuantity() : 1;
            calculatedTotal += product.getPrice() * qty;

            OrderItem item = new OrderItem();
            item.setProductId(itemDto.getProductId());
            item.setUser(user);
            item.setPrice(Double.valueOf(product.getPrice()));
            item.setQuantity(qty);
            order.addItem(item);
        }

        order.setTotalAmount(orderReqDto.getTotalAmount() != null ? orderReqDto.getTotalAmount() : calculatedTotal);
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }
}
