package com.smartcollab.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class Card implements Serializable {

	private static final long serialVersionUID = -4816296699420136871L;

	@Id
	private String id;
	private String loginCreator;
	private String loginModerator;
	private String title;
	private String description;
	private LocalDate dateNow = LocalDate.now();
	private Set<String> userLikes = new HashSet<String>();
	private List<Comment> cardComments = new ArrayList<Comment>();
	@Transient
	private String displayDateNow = dateNow.toString(); // dateFormat
	@Transient
	private String loggedUser;
	@Transient
	private String comment;

}
