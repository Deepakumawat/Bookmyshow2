package Bookmyshow2.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "shows")
public class Show extends BaseModel{
    //    private Movie movie;
    private Date startTime;
    private Date endTime;

    @ElementCollection
    @Enumerated(value = EnumType.ORDINAL)
    private List<Feature> features;
    @ManyToOne
    private Screen screen;
}