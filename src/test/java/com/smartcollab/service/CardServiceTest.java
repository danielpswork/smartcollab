package com.smartcollab.service;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

import com.smartcollab.domain.Card;
import com.smartcollab.repository.CardsRepository;

@RunWith(MockitoJUnitRunner.class)
public class CardServiceTest {

	@InjectMocks
	private CardService cardService;

	@Mock
	private CardsRepository cardsRepository;

	@Autowired

	@Test
	public void saveCard() {

		Card savedCard = new Card();
		savedCard.setId("1");
		Mockito.when(cardsRepository.save(Matchers.any(Card.class))).thenReturn(savedCard);

		String generatedId = cardService.saveCard(new Card());
		assertThat(generatedId, equalTo(savedCard.getId()));
	}

}