package Bookmyshow2.dtos;

import lombok.Data;
import org.springframework.boot.autoconfigure.security.SecurityProperties;

@Data
public class SignupUserResponseDTO {
    private Response response;
    private String name;
    private String email;


    public static SignupUserResponseDTO getSuccessDTO(SecurityProperties.User user){
        SignupUserResponseDTO responseDTO = new SignupUserResponseDTO();
        Response response = new Response();
        response.setStatus(ResponseStatus.SUCCESS);
        response.setMessage("User created successfully");
        responseDTO.setResponse(response);
        responseDTO.setEmail(user.getName());
        responseDTO.setName(user.getName());
        return responseDTO;
    }

}