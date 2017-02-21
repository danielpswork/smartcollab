package com.smartcollab.service;

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

	public String saveCard(Card newCard) {
		Card card = repository.save(newCard);
		return card.getId();
	}

	public Card getCardById(String Id) {
		return repository.findOne(Id);
	}
}
