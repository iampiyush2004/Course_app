package com.UPSKILL.Server.utils;

import com.UPSKILL.Server.entities.Course;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    private final String[] quotes = {
            "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
            "Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi",
            "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
            "The more that you read, the more things you will know. The more that you learn, the more places you'll go. — Dr. Seuss",
            "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence. — Abigail Adams"
    };

    public void sendWelcomeEmail(String toEmail, String name, List<Course> recommendations) {
        String quote = quotes[new Random().nextInt(quotes.length)];

        StringBuilder coursesHtml = new StringBuilder("<h3>Recommended Courses for You:</h3><ul>");
        for (Course course : recommendations) {
            coursesHtml.append(String.format("<li><b>%s</b> - %s</li>", course.getTitle(), course.getDescription()));
        }
        coursesHtml.append("</ul>");

        String content = String.format(
                "<h1>Welcome to UpScale, %s!</h1>" +
                        "<p>We are thrilled to have you on board.</p>" +
                        "<blockquote><i>\"%s\"</i></blockquote>" +
                        "%s" +
                        "<p>Start your learning journey today!</p>",
                name, quote, coursesHtml.toString());

        sendEmail(toEmail, "Welcome to UpScale", content);
    }

    public void sendThankYouEmail(String toEmail, String name, Course course) {
        String content = String.format(
                "<h1>Thank You for Your Purchase, %s!</h1>" +
                        "<p>You have successfully enrolled in <b>%s</b>.</p>" +
                        "<p>Course Description: %s</p>" +
                        "<p>Happy Learning!</p>",
                name, course.getTitle(), course.getDescription());

        sendEmail(toEmail, "Thank you for purchasing " + course.getTitle(), content);
    }

    public void sendCoursePublishedEmail(String toEmail, String name, String courseName) {
        String content = String.format(
                "<h1>Congratulations, %s!</h1>" +
                        "<p>Your course <b>\"%s\"</b> has been published successfully.</p>" +
                        "<p>It is now available for students to enroll.</p>",
                name, courseName);

        sendEmail(toEmail, "Your course \"" + courseName + "\" has been published", content);
    }

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
