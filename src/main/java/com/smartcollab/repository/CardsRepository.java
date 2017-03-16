package com.smartcollab.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcollab.domain.Card;

@Repository
public interface CardsRepository extends MongoRepository<Card, String> {

	List<Card> findByLogin(String login);
}
