package Bookmyshow2.service;

import Bookmyshow2.models.*;
import Bookmyshow2.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DatabaseSeeder {

    @Autowired private CityRepository cityRepo;
    @Autowired private TheatreRepository theatreRepo;
    @Autowired private ScreenRepository screenRepo;
    @Autowired private SeatsRepository seatRepo;
    @Autowired private MovieRepository movieRepo;
    @Autowired private ShowRepository showRepo;
    @Autowired private ShowSeatRepository showSeatRepo;
    @Autowired private SeatTypeShowRepository seatTypeShowRepo;
    @Autowired private UserRepository userRepo;

    @Transactional
    public void seed() {
        System.out.println("=== BookMyShow DB Seeder: Starting ===");

        List<Movie> movies = seedMovies();
        List<City>  cities = seedCities();
        seedTheatresScreensShowsForCities(cities, movies);
        seedUsers();

        System.out.println("=== BookMyShow DB Seeder: Done ===");
    }

    // ── 1. Movies ───────────────────────────────────────────────────────────

    private List<Movie> seedMovies() {
        Object[][] data = {
            {"Pushpa 2: The Rule",      "Action,Thriller",       "Telugu", "Telugu,Hindi,Tamil,Malayalam", 8.5, 188, "Sukumar",        "Allu Arjun, Rashmika Mandanna, Fahadh Faasil",    "A",  "2D,3D",      "2024-12-05", "#8B0000", 285000},
            {"Kalki 2898 AD",           "Sci-Fi,Action",         "Telugu", "Telugu,Hindi,Tamil,Kannada",  7.8, 180, "Nag Ashwin",     "Prabhas, Deepika Padukone, Amitabh Bachchan",     "UA", "2D,3D,IMAX", "2024-06-27", "#1a1a2e", 192000},
            {"Stree 2",                 "Horror,Comedy",         "Hindi",  "Hindi",                       8.1, 138, "Amar Kaushik",   "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi", "UA", "2D,3D",      "2024-08-15", "#2d1b33", 176000},
            {"Fighter",                 "Action,Drama",          "Hindi",  "Hindi,Tamil,Telugu",          5.9, 166, "Siddharth Anand","Hrithik Roshan, Deepika Padukone, Anil Kapoor",   "UA", "2D,3D,IMAX", "2024-01-25", "#1c3a4a", 98000},
            {"Animal",                  "Action,Thriller",       "Hindi",  "Hindi,Telugu,Tamil",          6.9, 202, "Sandeep Reddy Vanga","Ranbir Kapoor, Rashmika Mandanna, Anil Kapoor","A","2D,3D",    "2023-12-01", "#1a0a00", 210000},
            {"HanuMan",                 "Superhero,Action",      "Telugu", "Telugu,Hindi,Tamil,Kannada",  7.9, 157, "Prasanth Varma", "Teja Sajja, Amritha Aiyer, Varalaxmi Sarathkumar","UA","2D,3D,IMAX","2024-01-12","#FF6B00", 145000},
            {"Bhool Bhulaiyaa 3",       "Horror,Comedy",         "Hindi",  "Hindi",                       7.0, 155, "Anees Bazmee",   "Kartik Aaryan, Madhuri Dixit, Vidya Balan",       "UA", "2D,3D",      "2024-11-01", "#1a0a2e", 132000},
            {"Devara: Part 1",          "Action,Thriller",       "Telugu", "Telugu,Hindi,Tamil",          6.0, 166, "Koratala Siva",  "Jr NTR, Janhvi Kapoor, Saif Ali Khan",            "A",  "2D,3D,IMAX", "2024-09-27", "#0a1628", 87000},
            {"Singham Returns",         "Action",                "Hindi",  "Hindi,Tamil,Telugu",          6.5, 160, "Rohit Shetty",   "Ajay Devgn, Kareena Kapoor, Arjun Kapoor",        "UA", "2D,3D",      "2024-08-15", "#8B6914", 113000},
            {"Munjya",                  "Horror,Comedy",         "Hindi",  "Hindi",                       7.2, 115, "Aditya Sarpotdar","Sharvari Wagh, Abhay Verma, Mona Singh",         "UA", "2D",         "2024-06-07", "#4a0e4e", 78000},
        };

        List<Movie> saved = new ArrayList<>();
        for (Object[] d : data) {
            Movie m = new Movie();
            m.setTitle((String)  d[0]);
            m.setGenre((String)  d[1]);
            m.setLanguage((String) d[2]);
            m.setLanguages((String) d[3]);
            m.setRating((double) d[4]);
            m.setDurationMinutes((int) d[5]);
            m.setDirector((String) d[6]);
            m.setCast((String)   d[7]);
            m.setCertification((String) d[8]);
            m.setFormat((String) d[9]);
            m.setReleaseDate((String) d[10]);
            m.setBgColor((String) d[11]);
            m.setVoteCount((int) d[12]);
            m.setDescription("A blockbuster " + d[1] + " film in " + d[2] + ". Directed by " + d[6] + ".");
            saved.add(movieRepo.save(m));
        }
        System.out.println("  [✓] Seeded " + saved.size() + " movies");
        return saved;
    }

    // ── 2. Cities ──────────────────────────────────────────────────────────

    private List<City> seedCities() {
        String[] names = {"Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"};
        List<City> cities = new ArrayList<>();
        for (String name : names) {
            City c = new City();
            c.setName(name);
            cities.add(cityRepo.save(c));
        }
        System.out.println("  [✓] Seeded " + cities.size() + " cities");
        return cities;
    }

    // ── 3. Theatres → Screens → Seats → Shows → ShowSeats → Pricing ────────

    private void seedTheatresScreensShowsForCities(List<City> cities, List<Movie> movies) {
        String[][][] theatreData = {
            {{"PVR Juhu",               "Juhu Tara Rd, Juhu, Mumbai 400049"},
             {"INOX R-City Mall",        "LBS Marg, Ghatkopar West, Mumbai 400086"}},
            {{"PVR Select City Walk",    "District Centre, Saket, New Delhi 110017"},
             {"INOX Nehru Place",        "Nehru Place, South Delhi 110019"}},
            {{"PVR Orion Mall",          "Brigade Gateway, Rajajinagar, Bangalore 560055"},
             {"Cinepolis Brookefield",   "Brookefield Mall, ITPL Main Rd, Bangalore 560037"}},
            {{"PVR Phoenix Marketcity", "Velachery Main Rd, Chennai 600042"},
             {"INOX VR Chennai",         "Koyambedu, Chennai 600107"}},
            {{"PVR Inorbit Mall",        "Inorbit Mall, Cyberabad, Hyderabad 500081"},
             {"INOX GVK One",            "GVK One Mall, Banjara Hills, Hyderabad 500034"}},
            {{"PVR Pavilion Mall",       "Nagar Rd, Pune 411014"},
             {"Cinepolis Westend Mall",  "Aundh, Pune 411007"}},
            {{"PVR Acropolis Mall",      "Rashbehari Connector, Kolkata 700045"},
             {"INOX South City Mall",    "Prince Anwar Shah Rd, Kolkata 700068"}},
        };

        int movieIdx = 0;
        int totalShows = 0;

        for (int ci = 0; ci < cities.size(); ci++) {
            City city = cities.get(ci);
            for (int ti = 0; ti < theatreData[ci].length; ti++) {
                Theatre theatre = new Theatre();
                theatre.setName(theatreData[ci][ti][0]);
                theatre.setAddress(theatreData[ci][ti][1]);
                theatre.setCity(city);
                theatreRepo.save(theatre);

                // 3 screens per theatre
                String[][] screenDefs = {
                    {"Screen 1 - Audi", "2D"},
                    {"Screen 2 - Audi", "3D"},
                    {"Screen 3 - IMAX", "IMAX"},
                };

                for (String[] sd : screenDefs) {
                    Screen screen = new Screen();
                    screen.setName(sd[0]);
                    screen.setStatus(ScreenStatus.OPERATIONAL);
                    screen.setTheatre(theatre);

                    List<Feature> screenFeatures = new ArrayList<>();
                    if (sd[1].contains("IMAX")) {
                        screenFeatures.add(Feature.IMAX);
                        screenFeatures.add(Feature.THREE_D);
                    } else if (sd[1].contains("3D")) {
                        screenFeatures.add(Feature.THREE_D);
                        screenFeatures.add(Feature.DOLBY_ATMOS);
                    } else {
                        screenFeatures.add(Feature.TWO_D);
                    }
                    screen.setFeatures(screenFeatures);
                    screenRepo.save(screen);

                    // Create seats for this screen
                    List<Seat> seats = createSeats(screen);
                    seatRepo.saveAll(seats);

                    // Pick a movie (rotate through the list)
                    Movie movie = movies.get(movieIdx % movies.size());
                    movieIdx++;

                    // Create 4 shows (morning, afternoon, evening, night)
                    int[][] showTimes = {{10, 0, 12, 30}, {13, 30, 16, 0}, {17, 0, 19, 30}, {20, 30, 23, 0}};

                    for (int[] time : showTimes) {
                        Show show = createShow(screen, movie, screenFeatures, time[0], time[1], time[2], time[3]);
                        showRepo.save(show);
                        totalShows++;

                        // Create ShowSeats for this show
                        List<ShowSeat> showSeats = new ArrayList<>();
                        for (Seat seat : seats) {
                            ShowSeat ss = new ShowSeat();
                            ss.setShow(show);
                            ss.setSeat(seat);
                            ss.setStatus(SeatStatus.AVAILABLE);
                            showSeats.add(ss);
                        }
                        showSeatRepo.saveAll(showSeats);

                        // Create pricing per seat type for this show
                        seedPricing(show, sd[1]);
                    }
                }
            }
        }
        System.out.println("  [✓] Seeded theatres, screens, seats, and " + totalShows + " shows");
    }

    private List<Seat> createSeats(Screen screen) {
        List<Seat> seats = new ArrayList<>();
        int x = 0, y = 0;

        // Silver: rows A–B, 10 seats each
        for (char row : new char[]{'A', 'B'}) {
            y = (row - 'A') * 45;
            for (int col = 1; col <= 10; col++) {
                x = (col - 1) * 40;
                seats.add(makeSeat(row + String.valueOf(col), SeatType.SILVER, SeatStatus.AVAILABLE, screen, x, y));
            }
        }
        // Gold: rows C–D, 10 seats each
        for (char row : new char[]{'C', 'D'}) {
            y = (row - 'A') * 45;
            for (int col = 1; col <= 10; col++) {
                x = (col - 1) * 40;
                seats.add(makeSeat(row + String.valueOf(col), SeatType.GOLD, SeatStatus.AVAILABLE, screen, x, y));
            }
        }
        // Platinum: row E, 8 seats
        y = ('E' - 'A') * 45;
        for (int col = 1; col <= 8; col++) {
            x = (col - 1) * 40;
            seats.add(makeSeat("E" + col, SeatType.PLATINUM, SeatStatus.AVAILABLE, screen, x, y));
        }
        // Recliner: row F, 6 seats
        y = ('F' - 'A') * 45;
        for (int col = 1; col <= 6; col++) {
            x = (col - 1) * 60;
            seats.add(makeSeat("F" + col, SeatType.RECLINER, SeatStatus.AVAILABLE, screen, x, y));
        }
        return seats;
    }

    private Seat makeSeat(String name, SeatType type, SeatStatus status, Screen screen, int x, int y) {
        Seat s = new Seat();
        s.setName(name);
        s.setSeatType(type);
        s.setStatus(status);
        s.setScreen(screen);
        s.setTopLeftX(x);
        s.setTopLeftY(y);
        s.setBottomRightX(x + 35);
        s.setBottomRightY(y + 35);
        return s;
    }

    private Show createShow(Screen screen, Movie movie, List<Feature> features, int sh, int sm, int eh, int em) {
        Show show = new Show();
        show.setScreen(screen);
        show.setMovie(movie);
        show.setFeatures(new ArrayList<>(features));

        Calendar start = Calendar.getInstance();
        start.set(Calendar.HOUR_OF_DAY, sh);
        start.set(Calendar.MINUTE, sm);
        start.set(Calendar.SECOND, 0);
        show.setStartTime(start.getTime());

        Calendar end = Calendar.getInstance();
        end.set(Calendar.HOUR_OF_DAY, eh);
        end.set(Calendar.MINUTE, em);
        end.set(Calendar.SECOND, 0);
        show.setEndTime(end.getTime());

        return show;
    }

    private void seedPricing(Show show, String screenType) {
        double silverBase  = screenType.equals("IMAX") ? 250 : screenType.equals("3D") ? 200 : 160;
        double goldBase    = screenType.equals("IMAX") ? 400 : screenType.equals("3D") ? 320 : 260;
        double platBase    = screenType.equals("IMAX") ? 600 : screenType.equals("3D") ? 480 : 380;
        double reclBase    = screenType.equals("IMAX") ? 900 : screenType.equals("3D") ? 750 : 600;

        for (Object[] pair : new Object[][]{
                {SeatType.SILVER, silverBase},
                {SeatType.GOLD, goldBase},
                {SeatType.PLATINUM, platBase},
                {SeatType.RECLINER, reclBase}}) {
            SeatTypeShow sts = new SeatTypeShow();
            sts.setShow(show);
            sts.setSeatType((SeatType) pair[0]);
            sts.setPrice((double) pair[1]);
            seatTypeShowRepo.save(sts);
        }
    }

    // ── 4. Users ───────────────────────────────────────────────────────────

    private void seedUsers() {
        Object[][] users = {
            {"Rahul Sharma",  "rahul@example.com",   "password123"},
            {"Priya Mehta",   "priya@example.com",   "password123"},
            {"Arjun Singh",   "arjun@example.com",   "password123"},
            {"Sneha Patel",   "sneha@example.com",   "password123"},
            {"Vikram Nair",   "vikram@example.com",  "password123"},
        };
        for (Object[] u : users) {
            if (!userRepo.existsByEmail((String) u[1])) {
                User user = new User();
                user.setName((String)  u[0]);
                user.setEmail((String) u[1]);
                user.setPassword((String) u[2]);
                userRepo.save(user);
            }
        }
        System.out.println("  [✓] Seeded 5 users");
    }
}
