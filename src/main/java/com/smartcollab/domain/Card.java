package com.smartcollab.domain;

import java.io.Serializable;
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
    private String title;
    private String description;
    private String author;
    private String creationDate;
    private String moderator;
    private Set<String> votedUsers = new HashSet<String>();
    
    public void setVotedUsers(String author){
    	this.votedUsers.add(author);
    }
    
    public void removeVotedUsers(String author){
    	this.votedUsers.remove(author);
    }
}
