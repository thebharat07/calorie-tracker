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
@Schema(description = "Goal vs actual comparison report with targets, actual averages, and percentage achieved")
public class GoalVsActualResponse {

    private LocalDate from;
    private LocalDate to;
    private boolean hasGoal;
    private List<MetricComparison> metrics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricComparison {
        private String metric;
        private Double actualDailyAvg;
        private Double target;
        private String unit;
        private Double percentageAchieved;
    }
}
