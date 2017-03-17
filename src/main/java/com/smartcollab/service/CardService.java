package com.smartcollab.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcollab.domain.Card;
import com.smartcollab.domain.Comment;
import com.smartcollab.repository.CardsRepository;
import com.smartcollab.utils.DateComparator;
import com.smartcollab.utils.LikesComparator;

@Service
public class CardService extends BaseService {

	@Autowired
	private CardsRepository repository;

	public List<Card> getCardsOrderedByLikes() {
		List<Card> temp = repository.findAll();
		Collections.sort(temp, new LikesComparator());

		return temp;
	}

	public List<Card> getLoggedUserCards() {
		List<Card> temp = repository.findByLogin(getLoggedUser());
		Collections.sort(temp, new LikesComparator());

		return temp;
	}

	public List<Card> getCardsOrderedByDate() {
		List<Card> temp = repository.findAll();
		Collections.sort(temp, new LikesComparator());
		Collections.sort(temp, new DateComparator());

		return temp;
	}

	public Card getCardById(String id) {
		return repository.findOne(id);
	}

	public String saveCard(Card newCard) {
		if (newCard.getId() == null) {
			newCard.setLogin(getLoggedUser());
			newCard.setAvatarUrl(getLoggedAvatarUrl());
			newCard.setDateTime(LocalDateTime.now());
		}
		Card card = repository.save(newCard);
		return card.getId();
	}

	public void deleteCard(String id) {
		Card card = repository.findOne(id);
		repository.delete(card);
	}

	public Card saveComment(List<String> data) {
		Card card = new Card();
		Comment comment = new Comment();

		String cardId = data.get(0);
		card = repository.findOne(cardId);
		comment.setLogin(getLoggedUser());
		comment.setText(data.get(1));
		comment.setDateTime(LocalDateTime.now());
		comment.setAvatarUrl(getLoggedAvatarUrl());

		card.getComments().add(comment);

		return repository.save(card);

	}

	public Card editComment(List<String> data) {
		Card cardTemp = new Card();

		String cardId = data.get(0);
		String commentAuthor = data.get(1);
		String newComment = data.get(3);
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d-M-yyyy-H-m-s");
        LocalDateTime commentDate = LocalDateTime.parse(data.get(2), formatter);

		cardTemp = repository.findOne(cardId);

		for (Comment comment : cardTemp.getComments()) {
			if (comment.getLogin().equalsIgnoreCase(commentAuthor) && comment.getDateTime().withNano(0).equals(commentDate))  {
				comment.setDateTime(LocalDateTime.now());
				comment.setText(newComment);
				break;
			}
		}
		
		return repository.save(cardTemp);
	}

	public Card deleteComment(List<String> data) {
		Card cardTemp = new Card();

		String cardId = data.get(0);
		String commentAuthor = data.get(1);
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d-M-yyyy-H-m-s");
        LocalDateTime commentDate = LocalDateTime.parse(data.get(2), formatter);

		cardTemp = repository.findOne(cardId);
		
		for (Iterator<Comment> iterator = cardTemp.getComments().iterator(); iterator.hasNext();) {
			Comment comment = iterator.next();
			if (comment.getLogin().equals(commentAuthor) &&
				comment.getDateTime().withNano(0).equals(commentDate)) {
				iterator.remove();
				break;
			}
		}
		
		return repository.save(cardTemp);
	}
}
