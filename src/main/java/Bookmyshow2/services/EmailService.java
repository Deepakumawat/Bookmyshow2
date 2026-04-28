package Bookmyshow2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendBookingConfirmation(
            String toEmail, String userName, String movieTitle,
            String theatreName, String city, String showDate, String showTime,
            String format, List<String> seats, double totalAmount, String ticketId) {

        if (mailSender == null) {
            throw new IllegalStateException("JavaMailSender not configured — check MAIL_USERNAME/MAIL_PASSWORD");
        }
        if (fromEmail.isEmpty()) {
            throw new IllegalStateException("MAIL_USERNAME env var is not set");
        }

        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed — " + movieTitle + " | BookMyShow");

            String seatsStr = String.join(", ", seats);
            String html = buildHtml(userName, movieTitle, theatreName, city, showDate,
                    showTime, format, seatsStr, totalAmount, ticketId);
            helper.setText(html, true);

            mailSender.send(msg);
            System.out.println("[EMAIL] Sent to " + toEmail);
        } catch (Exception e) {
            throw new RuntimeException("SMTP error: " + e.getMessage(), e);
        }
    }

    private String buildHtml(String userName, String movieTitle, String theatreName,
            String city, String showDate, String showTime, String format, String seatsStr,
            double totalAmount, String ticketId) {
        String location = (theatreName != null && !theatreName.isEmpty())
            ? theatreName + (city != null && !city.isEmpty() ? ", " + city : "")
            : (city != null ? city : "");
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
              <div style="background:#cc0000;padding:24px;text-align:center;">
                <h1 style="color:white;margin:0;font-size:28px;">bookmyshow</h1>
                <p style="color:#ffcccc;margin:4px 0 0;">Your booking is confirmed! 🎉</p>
              </div>
              <div style="padding:32px;">
                <h2 style="color:#cc0000;margin-top:0;">Hi %s,</h2>
                <p style="color:#94a3b8;">Your tickets have been booked. Enjoy the show!</p>
                <div style="background:#1a2332;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #cc0000;">
                  <table style="width:100%%;border-collapse:collapse;">
                    <tr><td style="padding:8px 0;color:#64748b;width:140px;">Movie</td><td style="padding:8px 0;font-weight:bold;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Location</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Date</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Time</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Format</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Seats</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Total Paid</td><td style="padding:8px 0;font-weight:bold;color:#22c55e;font-size:18px;">&#8377;%.0f</td></tr>
                    <tr><td style="padding:8px 0;color:#64748b;">Booking ID</td><td style="padding:8px 0;color:#399aff;font-size:12px;">%s</td></tr>
                  </table>
                </div>
                <p style="color:#64748b;font-size:13px;">Please arrive 15 minutes before showtime.</p>
                <p style="color:#64748b;font-size:12px;">Thank you for choosing BookMyShow! 🍿</p>
              </div>
            </div>
            """.formatted(userName, movieTitle, location, showDate, showTime,
                    format, seatsStr, totalAmount, ticketId);
    }
}
