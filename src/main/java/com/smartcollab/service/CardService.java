package com.smartcollab.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcollab.domain.Card;
import com.smartcollab.repository.CardsRepository;

@Service
public class CardService {

    @Autowired
    private CardsRepository repository;

    public List<Card> getCards() {
        return repository.findAll();
    }
    
    public Card getCardById (String id) {
    	return repository.findOne(id);
    }

    public String saveCard(Card newCard) {

    	if(newCard.getId()==null) {
        	newCard.setDateTime(LocalDate.now());
    	}
        Card card = repository.save(newCard);
        return card.getId();
    }
}
