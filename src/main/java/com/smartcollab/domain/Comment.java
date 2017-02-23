package com.smartcollab.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Comment {
	private String text;
	private String login;
	private LocalDateTime dateTime;
}
