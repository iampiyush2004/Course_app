package com.UPSKILL.Server.services;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.repositories.CourseRepository;
import com.UPSKILL.Server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public String createOrder(Double amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);
        return order.toString();
    }

    public boolean capturePayment(String userId, String courseId, String paymentId, Double amount)
            throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject captureRequest = new JSONObject();
        captureRequest.put("amount", (int) (amount * 100));
        captureRequest.put("currency", "INR");

        Payment payment = razorpay.payments.capture(paymentId, captureRequest);

        if (payment.get("status").equals("captured")) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getCoursePurchased() == null)
                user.setCoursePurchased(new ArrayList<>());
            user.getCoursePurchased().add(courseId);
            userRepository.save(user);

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            course.setUsersEnrolled((course.getUsersEnrolled() != null ? course.getUsersEnrolled() : 0) + 1);
            courseRepository.save(course);

            return true;
        }

        return false;
    }

    public boolean isCoursePurchased(String userId, String courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getCoursePurchased() != null && user.getCoursePurchased().contains(courseId);
    }
}
