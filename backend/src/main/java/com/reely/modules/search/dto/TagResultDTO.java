package com.reely.modules.search.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagResultDTO {
    private Long id;
    private String name;
    private Long videoCount;
}
