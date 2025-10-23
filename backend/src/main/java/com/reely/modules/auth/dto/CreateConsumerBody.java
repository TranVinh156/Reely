package com.reely.modules.auth.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateConsumerBody {
    private String username;

    private String customId;

    private List<String> tags;
}
