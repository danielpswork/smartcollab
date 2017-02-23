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
import com.smartcollab.domain.Comment;
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

	@RequestMapping(path = "/comments/{id}", method = RequestMethod.GET)
	@ResponseBody
	public List<Comment> getComments(@PathVariable(name = "id") String id) {
		return service.getCardById(id).getCardComments();
	}
	
	@RequestMapping(path = "/cardById/{id}", method = RequestMethod.GET)
	@ResponseBody
	public Card getCardById(@PathVariable(name = "id") String id) {
		return service.getCardById(id);
	}

	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public String saveCard(@RequestBody Card card) {
		return service.saveCard(card);
	}

	@RequestMapping(path = "/updateCardModerator", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public String updateCardModerator(@RequestBody Card card) {
		Card card2 = service.getCardById(card.getId());
		card2.setLoginModerator(card.getLoginModerator());
		return service.saveCard(card2);
	}

	@RequestMapping(path = "/updateCardLike", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public String updateCardLike(@RequestBody Card card) {
		Card card2 = service.getCardById(card.getId());
		if (card2.getUserLikes().contains(card.getLoggedUser())) {
			card2.getUserLikes().remove(card.getLoggedUser());
		} else {
			card2.getUserLikes().add(card.getLoggedUser());
		}
		return service.saveCard(card2);
	}

	@RequestMapping(path = "/saveComment", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public String saveComment(@RequestBody Card card) {
		Card card2 = service.getCardById(card.getId());

		Comment comment = new Comment();
		comment.setUser(card.getLoggedUser());
		comment.setComment(card.getComment());

		card2.getCardComments().add(comment);
		return service.saveCard(card2);
	}
}
