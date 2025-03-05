package Bookmyshow2.dtos;

import lombok.Data;

@Data
public class Response {
    private ResponseStatus status;
    private String message;
}