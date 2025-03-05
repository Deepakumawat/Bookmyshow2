package Bookmyshow2.dtos;

import lombok.Data;

@Data
public class SignupUserRequestDTO {
    public String name;
    public String email;
    public String password;
}