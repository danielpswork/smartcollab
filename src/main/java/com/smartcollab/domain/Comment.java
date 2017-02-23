package com.smartcollab.domain;

import java.io.Serializable;
import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class Comment implements Serializable {

	private static final long serialVersionUID = 4631178026680847419L;

	private String user;
	private String comment;
	private LocalDate dateNow = LocalDate.now();

	public Comment() {

	}

}
