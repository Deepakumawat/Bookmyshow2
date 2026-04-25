package Bookmyshow2.models;

import jakarta.persistence.*;

@Entity
public class Movie extends BaseModel {

    private String title;
    private String genre;           // comma-separated e.g. "Action,Thriller"
    private String language;        // primary language
    private String languages;       // all dubbed versions e.g. "Telugu,Hindi,Tamil"

    @Column(length = 1000)
    private String description;

    private double rating;
    private int durationMinutes;
    private String director;

    @Column(name = "movie_cast", length = 500)
    private String cast;            // comma-separated

    private String certification;   // U / UA / A
    private String format;          // e.g. "2D,3D,IMAX"
    private String releaseDate;     // YYYY-MM-DD
    private String bgColor;         // hex color for UI
    private String posterUrl;

    private int voteCount;          // number of ratings

    // ── Getters & Setters ───────────────────────────────────────────────

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getCast() { return cast; }
    public void setCast(String cast) { this.cast = cast; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public int getVoteCount() { return voteCount; }
    public void setVoteCount(int voteCount) { this.voteCount = voteCount; }
}
