package Bookmyshow2;


import Bookmyshow2.controllers.UserController;
import Bookmyshow2.dtos.SignupUserRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Bookmyshow2Application implements CommandLineRunner {

	private final UserController userController;

	@Autowired
	public Bookmyshow2Application(UserController userController) {
		this.userController = userController;
	}

	public static void main(String[] args) {
		SpringApplication.run(Bookmyshow2Application.class, args);
	}



	@Override
	public void run(String... args) {

			System.out.println("Starting to insert user");
			SignupUserRequestDTO dto = new SignupUserRequestDTO();
			dto.setEmail("jofffhn@doe.com");
			dto.setPassword("password");
			dto.setName("John");
			userController.signupUser(dto);
			System.out.println("User has been inserted");


	}
}