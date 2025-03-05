package Bookmyshow2.services;

import Bookmyshow2.models.Ticket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TicketService {

    @Autowired
    public TicketService() {
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Ticket bookTicket() {

        return null;
    }
}