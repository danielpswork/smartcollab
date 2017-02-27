package com.smartcollab.utils;

import java.util.Comparator;

import com.smartcollab.domain.Card;

public class LikesComparator implements Comparator<Card> {
	@Override
	
	public int compare(Card a, Card b) {
        if (a.getLikes().size() < b.getLikes().size()){
        	return -1;
        } else if (a.getLikes().size() > b.getLikes().size()){
        	return 1;
        } else
        	return 0;
    }

}
