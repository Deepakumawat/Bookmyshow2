package Bookmyshow2.dtos;

import Bookmyshow2.models.Ticket;

public class BookTicketResponseDTO {
    private Response response;
    private Ticket ticket;

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public static BookTicketResponseDTO getFailureDTO(String message){
        BookTicketResponseDTO responseDTO = new BookTicketResponseDTO();
        Response response = new Response();
        response.setStatus(ResponseStatus.FAILURE);
        response.setMessage(message);
        responseDTO.setResponse(response);
        return responseDTO;
    }

    public static BookTicketResponseDTO getSuccessDTO(Ticket ticket){
        BookTicketResponseDTO responseDTO = new BookTicketResponseDTO();
        Response response = new Response();
        response.setStatus(ResponseStatus.SUCCESS);
        response.setMessage("Ticket created successfully");
        responseDTO.setResponse(response);
        responseDTO.setTicket(ticket);
        return responseDTO;
    }
}