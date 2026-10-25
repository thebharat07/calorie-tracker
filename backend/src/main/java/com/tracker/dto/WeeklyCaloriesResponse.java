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
@Schema(description = "Weekly calorie summary report with daily breakdown and target goal")
public class WeeklyCaloriesResponse {

    private LocalDate weekStart;
    private LocalDate weekEnd;
    private Integer goalCalories;
    private List<DayCalorieItem> days;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayCalorieItem {
        private LocalDate date;
        private Integer calories;
    }
}
