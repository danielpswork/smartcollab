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

    public void saveCard(Card newCard) {
        repository.save(newCard);
    }
}
