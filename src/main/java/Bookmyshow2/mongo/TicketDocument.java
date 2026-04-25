package Bookmyshow2.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.util.List;

@Document(collection = "tickets")
public class TicketDocument {

    @Id
    private String id;

    @Indexed
    private String userId;
    private String userEmail;
    private String userName;

    private String movieTitle;
    private String movieGenre;
    private String theatreName;
    private String city;
    private String showDate;
    private String showTime;
    private String format;       // 2D, 3D, IMAX

    private List<String> seats;
    private String seatType;     // SILVER, GOLD, PLATINUM, RECLINER
    private int    quantity;
    private double baseAmount;
    private double convenienceFee;
    private double totalAmount;

    private String status;       // CONFIRMED, CANCELLED, PENDING
    private String bookedAt;
    private String paymentMethod;

    public TicketDocument() {}

    public static TicketDocument create(String userId, String userEmail, String userName,
                                        String movieTitle, String movieGenre,
                                        String theatreName, String city,
                                        String showDate, String showTime, String format,
                                        List<String> seats, String seatType,
                                        double baseAmount, double convenienceFee,
                                        String paymentMethod) {
        TicketDocument t = new TicketDocument();
        t.userId         = userId;
        t.userEmail      = userEmail;
        t.userName       = userName;
        t.movieTitle     = movieTitle;
        t.movieGenre     = movieGenre;
        t.theatreName    = theatreName;
        t.city           = city;
        t.showDate       = showDate;
        t.showTime       = showTime;
        t.format         = format;
        t.seats          = seats;
        t.seatType       = seatType;
        t.quantity       = seats != null ? seats.size() : 0;
        t.baseAmount     = baseAmount;
        t.convenienceFee = convenienceFee;
        t.totalAmount    = baseAmount + convenienceFee;
        t.status         = "CONFIRMED";
        t.bookedAt       = Instant.now().toString();
        t.paymentMethod  = paymentMethod;
        return t;
    }

    // Getters
    public String getId()             { return id; }
    public String getUserId()         { return userId; }
    public String getUserEmail()      { return userEmail; }
    public String getUserName()       { return userName; }
    public String getMovieTitle()     { return movieTitle; }
    public String getMovieGenre()     { return movieGenre; }
    public String getTheatreName()    { return theatreName; }
    public String getCity()           { return city; }
    public String getShowDate()       { return showDate; }
    public String getShowTime()       { return showTime; }
    public String getFormat()         { return format; }
    public List<String> getSeats()    { return seats; }
    public String getSeatType()       { return seatType; }
    public int    getQuantity()       { return quantity; }
    public double getBaseAmount()     { return baseAmount; }
    public double getConvenienceFee() { return convenienceFee; }
    public double getTotalAmount()    { return totalAmount; }
    public String getStatus()         { return status; }
    public void   setStatus(String s) { this.status = s; }
    public String getBookedAt()       { return bookedAt; }
    public String getPaymentMethod()  { return paymentMethod; }
}
