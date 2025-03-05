package Bookmyshow2.controllers;

import Bookmyshow2.dtos.BookTicketResponseDTO;
import Bookmyshow2.models.Ticket;
import Bookmyshow2.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    public BookTicketResponseDTO bookTicket(){
        Ticket ticket;
        try {
            ticket = ticketService.bookTicket();
        } catch (Exception e){
            return BookTicketResponseDTO.getFailureDTO(e.getMessage());
        }
        return BookTicketResponseDTO.getSuccessDTO(ticket);
    }
}