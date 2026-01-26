package com.cineverse.booking.controller.user;

import com.cineverse.booking.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/booking/webhooks/razorpay")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final PaymentService paymentService;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            HttpServletRequest request,
            @RequestHeader("X-Razorpay-Signature") String signature
    ) throws Exception {

        String payload = readPayload(request);

        verifySignature(payload, signature);

        // extract fields (minimal parsing)
        String orderId = payload.split("\"order_id\":\"")[1].split("\"")[0];
        String paymentId = payload.split("\"id\":\"")[1].split("\"")[0];

        paymentService.handlePaymentSuccess(orderId, paymentId, signature);

        return ResponseEntity.ok("OK");
    }

    private void verifySignature(String payload, String actualSignature) throws Exception {

        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec =
                new SecretKeySpec(webhookSecret.getBytes(), "HmacSHA256");
        sha256Hmac.init(keySpec);

        byte[] hash = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        String expectedSignature = Hex.encodeHexString(hash);

        if (!expectedSignature.equals(actualSignature)) {
            throw new RuntimeException("Invalid Razorpay signature");
        }
    }

    private String readPayload(HttpServletRequest request) throws Exception {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }
}
