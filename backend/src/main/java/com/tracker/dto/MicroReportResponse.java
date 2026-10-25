package com.tracker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Micronutrient average daily intake report")
public class MicroReportResponse {

    private LocalDate from;
    private LocalDate to;
    private Long activeDaysCount;
    private List<MicroAverageItem> nutrients;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MicroAverageItem {
        private String nutrient;
        private Double avgDailyAmount;
        private String unit;
    }
}
