package com.moviebooking.dto.response;

/**
 * Response DTO for Razorpay order creation.
 * Contains details needed by frontend to initiate payment.
 */
public class RazorpayOrderResponse {

    private Long bookingId;
    private String razorpayOrderId;
    private Integer amount;
    private String currency;
    private String razorpayKeyId;

    // Default constructor
    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(Long bookingId, String razorpayOrderId, 
                                  Integer amount, String currency, String razorpayKeyId) {
        this.bookingId = bookingId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }
}
