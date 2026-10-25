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
@Schema(description = "Macronutrient totals grouped by day or week")
public class MacroReportResponse {

    private LocalDate from;
    private LocalDate to;
    private String groupBy;
    private List<MacroBucketItem> buckets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MacroBucketItem {
        private String period; // Date string or Week label
        private Double proteinG;
        private Double carbsG;
        private Double fatG;
        private Integer calories;
    }
}
