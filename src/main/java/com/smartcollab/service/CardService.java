package com.smartcollab.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcollab.domain.Card;
import com.smartcollab.domain.Comment;
import com.smartcollab.repository.CardsRepository;
import com.smartcollab.utils.DateComparator;
import com.smartcollab.utils.LikesComparator;

@Service
public class CardService {

    @Autowired
    private CardsRepository repository;

    public List<Card> getCardsOrderedByLikes() {
        List<Card> temp = repository.findAll();
        Collections.sort(temp,new LikesComparator());
    	
    	return temp;
    }
    
    public List<Card> getCardsOrderedByDate() {
        List<Card> temp = repository.findAll();
        Collections.sort(temp,new DateComparator());
    	
    	return temp;
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
    
    public void deleteCard(String id){
    	Card card = repository.findOne(id);
    	repository.delete(card);
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
