package Bookmyshow2.controllers;

import Bookmyshow2.dtos.SignupUserRequestDTO;
import Bookmyshow2.dtos.SignupUserResponseDTO;
import Bookmyshow2.models.User;
import Bookmyshow2.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/users/signup - Register a new user
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupUserResponseDTO> signup(@RequestBody SignupUserRequestDTO request) {
        try {
            User user = userService.signupUser(request.getName(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok(SignupUserResponseDTO.getSuccessDTO(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(SignupUserResponseDTO.getFailureDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(SignupUserResponseDTO.getFailureDTO("Registration failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/users/login - Login user
     */
    @PostMapping("/login")
    public ResponseEntity<SignupUserResponseDTO> login(@RequestBody SignupUserRequestDTO request) {
        try {
            User user = userService.loginUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(SignupUserResponseDTO.getSuccessDTO(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(SignupUserResponseDTO.getFailureDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(SignupUserResponseDTO.getFailureDTO("Login failed: " + e.getMessage()));
        }
    }

    /**
     * GET /api/users/{id} - Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SignupUserResponseDTO> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(SignupUserResponseDTO.getSuccessDTO(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(SignupUserResponseDTO.getFailureDTO(e.getMessage()));
        }
    }

    /**
     * PUT /api/users/{id} - Update user profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<SignupUserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody SignupUserRequestDTO request) {
        try {
            User user = userService.updateUser(id, request.getName(), request.getEmail());
            return ResponseEntity.ok(SignupUserResponseDTO.getSuccessDTO(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(SignupUserResponseDTO.getFailureDTO(e.getMessage()));
        }
    }
}