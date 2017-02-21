package com.smartcollab.domain;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class Card implements Serializable {

    private static final long serialVersionUID = -4816296699420136871L;

    @Id
    private String id;
    private String login;
    private String title;
    private String description;
    private LocalDate dateTime;
    private String moderator;
    private Set<String> likes = new HashSet<String>();
}
