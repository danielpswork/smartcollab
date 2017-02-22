package com.smartcollab.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class Comment implements Serializable {

	private static final long serialVersionUID = 4943607486102794847L;

    private String text;
    private String author;
    private String creationDate;
}
