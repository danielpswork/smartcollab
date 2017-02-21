package com.smartcollab.domain;

import java.io.Serializable;
import java.time.LocalDate;

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
	private Integer likes;
	@Transient
	private String displayDateNow = dateNow.toString(); // TODO dateFormat

}
