package com.smartcollab.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcollab.domain.Card;
import com.smartcollab.domain.Comment;
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

    	if(newCard.getId() == null) {
        	newCard.setDateTime(LocalDateTime.now());
    	}
        Card card = repository.save(newCard);
        return card.getId();
    }
    
    public Card saveComment(List<String> data){
		Card temp = new Card();
		Comment aux = new Comment();
    	
		String cardId = data.get(0);
    	temp = repository.findOne(cardId);
    	aux.setLogin(data.get(1));
    	aux.setText(data.get(2));
    	aux.setDateTime(LocalDateTime.now());
    	
    	temp.getComments().add(aux);
    	
    	return repository.save(temp);

    }
}
