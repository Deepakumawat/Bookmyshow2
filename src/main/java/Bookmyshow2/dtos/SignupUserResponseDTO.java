package Bookmyshow2.dtos;

import Bookmyshow2.models.User;

public class SignupUserResponseDTO {
    private Response response;
    private String name;
    private String email;

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static SignupUserResponseDTO getSuccessDTO(User user){
        SignupUserResponseDTO responseDTO = new SignupUserResponseDTO();
        Response response = new Response();
        response.setStatus(ResponseStatus.SUCCESS);
        response.setMessage("User created successfully");
        responseDTO.setResponse(response);
        responseDTO.setEmail(user.getEmail());
        responseDTO.setName(user.getName());
        return responseDTO;
    }

    public static SignupUserResponseDTO getFailureDTO(String message){
        SignupUserResponseDTO responseDTO = new SignupUserResponseDTO();
        Response response = new Response();
        response.setStatus(ResponseStatus.FAILURE);
        response.setMessage(message);
        responseDTO.setResponse(response);
        return responseDTO;
    }

}