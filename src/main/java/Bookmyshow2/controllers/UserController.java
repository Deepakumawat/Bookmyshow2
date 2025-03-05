package Bookmyshow2.controllers;

import Bookmyshow2.dtos.SignupUserRequestDTO;
import Bookmyshow2.dtos.SignupUserResponseDTO;
import Bookmyshow2.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(path = "/signup")
    public void signupUser(SignupUserRequestDTO requestDTO){
        SecurityProperties.User user = userService.signupUser(requestDTO.getName(), requestDTO.getEmail(), requestDTO.getPassword());
        SignupUserResponseDTO.getSuccessDTO(user);
    }

    @RequestMapping(path = "/signup_phone")
    public SignupUserResponseDTO signupUserPhone(SignupUserRequestDTO requestDTO){
        SecurityProperties.User user = userService.signupUser(requestDTO.getName(), requestDTO.getEmail(), requestDTO.getPassword());
        return SignupUserResponseDTO.getSuccessDTO(user);
    }
}