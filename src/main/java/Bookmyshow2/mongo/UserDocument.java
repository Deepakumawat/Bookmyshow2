package Bookmyshow2.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;

@Document(collection = "users")
public class UserDocument {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String city;
    private String phone;
    private String createdAt;
    private String lastLoginAt;
    private int totalBookings;
    private double totalSpent;
    private String membershipTier; // BRONZE, SILVER, GOLD, PLATINUM

    public UserDocument() {}

    public UserDocument(String name, String email, String city) {
        this.name        = name;
        this.email       = email;
        this.city        = city;
        this.createdAt   = Instant.now().toString();
        this.lastLoginAt = Instant.now().toString();
        this.totalBookings = 0;
        this.totalSpent    = 0;
        this.membershipTier = "BRONZE";
    }

    public void recordLogin()  { this.lastLoginAt = Instant.now().toString(); }
    public void recordBooking(double amount) {
        this.totalBookings++;
        this.totalSpent += amount;
        this.membershipTier = totalSpent > 10000 ? "PLATINUM"
                            : totalSpent > 5000  ? "GOLD"
                            : totalSpent > 2000  ? "SILVER" : "BRONZE";
    }

    // Getters & Setters
    public String getId()             { return id; }
    public String getName()           { return name; }
    public void   setName(String n)   { this.name = n; }
    public String getEmail()          { return email; }
    public void   setEmail(String e)  { this.email = e; }
    public String getCity()           { return city; }
    public void   setCity(String c)   { this.city = c; }
    public String getPhone()          { return phone; }
    public void   setPhone(String p)  { this.phone = p; }
    public String getCreatedAt()      { return createdAt; }
    public String getLastLoginAt()    { return lastLoginAt; }
    public int    getTotalBookings()  { return totalBookings; }
    public double getTotalSpent()     { return totalSpent; }
    public String getMembershipTier() { return membershipTier; }
}
