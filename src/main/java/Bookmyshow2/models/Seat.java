package Bookmyshow2.models;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Seat extends BaseModel{
    private String name;
    SeatStatus status;
    SeatType seatType;
    int topLeftX;
    int topLeftY;
    int bottomRightX;
    int bottomRightY;
    @ManyToOne
    Screen screen;
}