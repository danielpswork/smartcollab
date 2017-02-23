package com.smartcollab.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.smartcollab.domain.Card;
import com.smartcollab.service.CardService;

@RestController
@RequestMapping("/cards")
public class CardsApi {

    @Autowired
    private CardService service;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Card> getCards() {
        return service.getCards();
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    @ResponseBody
    public Card getCardById(@PathVariable String id) {
        return service.getCardById(id);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/login{login}")
    @ResponseBody
    public List<Card> getCardsByLogin(@PathVariable String login) {
        List<Card> cards =  service.getCards();
        
    	for (Card card : cards) {
    		if(!card.getLogin().equals(login)) {
    			cards.remove(card);
    		}
    	}
    	
    	return cards;
    }


    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public String saveCard(@RequestBody Card card) {
        return service.saveCard(card);
    }
    
    @RequestMapping(method = RequestMethod.POST, value="/comment")
    @ResponseStatus(HttpStatus.CREATED)
    public Card saveComment(@RequestBody List<String> commentData) {
        return service.saveComment(commentData);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/{id}/{moderator}")
    @ResponseBody
    public Card setModerator(@PathVariable String id,@PathVariable String moderator) {
         Card card = service.getCardById(id);
         card.setModerator(moderator);
         saveCard(card);
         
         return card;
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "like/{id}/{login}")
    @ResponseBody
    public Card like(@PathVariable String id,@PathVariable String login) {
         Card card = service.getCardById(id);
         if(card.getLikes().contains(login)) {
             card.getLikes().remove(login);
         } else {
             card.getLikes().add(login);
         }
         
         saveCard(card);        	 
         return card;
    }
    
    
}
