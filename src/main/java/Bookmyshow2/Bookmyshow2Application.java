package Bookmyshow2;

import Bookmyshow2.service.DatabaseSeeder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Bookmyshow2Application implements CommandLineRunner {

	@Autowired
	private DatabaseSeeder databaseSeeder;

	public static void main(String[] args) {
		SpringApplication.run(Bookmyshow2Application.class, args);
	}

	@Override
	public void run(String... args) {
		databaseSeeder.seed();
	}
}
