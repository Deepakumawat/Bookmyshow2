package Bookmyshow2.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name = "shows")
public class Show extends BaseModel {

    @ManyToOne
    @JsonIgnoreProperties({"screens"})
    private Movie movie;

    private Date startTime;
    private Date endTime;

    @ElementCollection
    @Enumerated(value = EnumType.ORDINAL)
    private List<Feature> features;
    @ManyToOne
    private Screen screen;

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Screen getScreen() {
        return screen;
    }

    public void setScreen(Screen screen) {
        this.screen = screen;
    }
}