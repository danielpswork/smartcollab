package com.smartcollab.domain;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
public class Card implements Serializable {

    private static final long serialVersionUID = -4816296699420136871L;

    @Id
    private String id;
    private String title;
    private String description;
}
