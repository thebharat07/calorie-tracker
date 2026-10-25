package com.tracker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for setting or updating nutritional and weight goals")
public class GoalRequest {

    @NotNull(message = "Daily calories target is required")
    @Positive(message = "Daily calories must be greater than 0")
    @Max(value = 15000, message = "Daily calories target cannot exceed 15,000 kcal")
    @Schema(example = "2100", description = "Target daily energy intake in kcal")
    private Integer dailyCalories;

    @NotNull(message = "Protein target is required")
    @Positive(message = "Protein target must be greater than 0")
    @Max(value = 1000, message = "Protein target cannot exceed 1,000 grams")
    @Schema(example = "140.0", description = "Target daily protein in grams")
    private Double proteinG;

    @NotNull(message = "Carbohydrates target is required")
    @Positive(message = "Carbohydrates target must be greater than 0")
    @Max(value = 2000, message = "Carbohydrates target cannot exceed 2,000 grams")
    @Schema(example = "220.0", description = "Target daily carbs in grams")
    private Double carbsG;

    @NotNull(message = "Fat target is required")
    @Positive(message = "Fat target must be greater than 0")
    @Max(value = 1000, message = "Fat target cannot exceed 1,000 grams")
    @Schema(example = "65.0", description = "Target daily fat in grams")
    private Double fatG;

    @NotNull(message = "Current weight is required")
    @Positive(message = "Current weight must be greater than 0")
    @Max(value = 500, message = "Current weight cannot exceed 500 kg")
    @Schema(example = "75.0", description = "Current body weight in kg")
    private Double currentWeightKg;

    @NotNull(message = "Target weight is required")
    @Positive(message = "Target weight must be greater than 0")
    @Max(value = 500, message = "Target weight cannot exceed 500 kg")
    @Schema(example = "70.0", description = "Target body weight in kg")
    private Double targetWeightKg;
}
