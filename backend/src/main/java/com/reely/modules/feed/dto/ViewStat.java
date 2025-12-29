package com.reely.modules.feed.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ViewStat {
    private Date date;
    private Long count;

    public ViewStat(Date date, Number count) {
        this.date = date;
        this.count = count != null ? count.longValue() : 0L;
    }
}
