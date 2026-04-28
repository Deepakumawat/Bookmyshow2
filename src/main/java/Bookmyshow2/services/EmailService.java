package Bookmyshow2.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String BREVO_API = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${mail.from.email:kumawatk2020@gmail.com}")
    private String fromEmail;

    public void sendBookingConfirmation(
            String toEmail, String userName, String movieTitle,
            String theatreName, String showDate, String showTime,
            String format, List<String> seats, double totalAmount, String ticketId) {

        if (brevoApiKey.isEmpty()) {
            throw new IllegalStateException("BREVO_API_KEY not configured in environment");
        }

        String html = buildHtml(userName, movieTitle, theatreName, showDate,
                showTime, format, String.join(", ", seats), totalAmount, ticketId);

        try {
            Map<String, Object> payload = Map.of(
                "sender",      Map.of("name", "BookMyShow", "email", fromEmail),
                "to",          List.of(Map.of("email", toEmail, "name", userName)),
                "subject",     "Booking Confirmed — " + movieTitle + " | BookMyShow",
                "htmlContent", html
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(BREVO_API))
                .header("accept", "application/json")
                .header("api-key", brevoApiKey)
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() >= 400) {
                throw new RuntimeException("Brevo " + resp.statusCode() + ": " + resp.body());
            }
            System.out.println("[EMAIL] Sent to " + toEmail + " — status " + resp.statusCode());
        } catch (Exception e) {
            throw new RuntimeException("Email failed: " + e.getMessage(), e);
        }
    }

    private String buildHtml(String userName, String movieTitle, String theatreName,
            String showDate, String showTime, String format, String seatsStr,
            double totalAmount, String ticketId) {
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
                    <tr><td style="padding:8px 0;color:#64748b;">Theatre</td><td style="padding:8px 0;color:#e2e8f0;">%s</td></tr>
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
            """.formatted(userName, movieTitle, theatreName, showDate, showTime,
                    format, seatsStr, totalAmount, ticketId);
    }
}
