package com.smartcollab.api;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @RequestMapping(path="/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Card getCardById(@PathVariable(name="id") String id){
        return service.getCardById(id);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public String saveCard(@RequestBody Card card) {
        return service.saveCard(card);
    }
    
    @RequestMapping(path="/{id}/{author}", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Card updateLike(@PathVariable(name="id") String id, @PathVariable(name="author") String author) {
    	Card card = service.getCardById(id);
    	if(!card.getVotedUsers().contains(author)) {
    		card.setVotedUsers(author);
    	} else {
    		card.removeVotedUsers(author);
    	}
    	service.saveCard(card);
		return card;
    }
}
