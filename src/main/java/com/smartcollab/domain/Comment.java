package com.smartcollab.domain;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
public class Comment {
	private String text;
	private String login;
	private LocalDateTime dateTime;
}
