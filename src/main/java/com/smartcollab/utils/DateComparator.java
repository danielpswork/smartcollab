package com.smartcollab.utils;

import java.util.Comparator;

import com.smartcollab.domain.Card;

public class DateComparator implements Comparator<Card> {
	@Override
	
	public int compare(Card a, Card b) {
		if (a.getDateTime().isBefore(b.getDateTime())){
        	return 1;
        } else if (a.getDateTime().isAfter(b.getDateTime())){
        	return -1;
        } else
        	return 0;
    }

}
