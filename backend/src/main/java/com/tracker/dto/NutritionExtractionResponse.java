package com.tracker.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "Nutritional values extracted from meal photo by Claude Vision")
public class NutritionExtractionResponse {

    @Schema(example = "Avocado Toast with Poached Eggs")
    private String detectedFoodName;

    @Schema(example = "BREAKFAST")
    private MealType mealType;

    @Schema(example = "2.0")
    private Double quantity;

    @Schema(example = "slices")
    private String unit;

    @Schema(example = "420")
    private Integer calories;

    @Schema(example = "19.0")
    private Double proteinG;

    @Schema(example = "34.0")
    private Double carbsG;

    @Schema(example = "22.0")
    private Double fatG;

    // Optional Micronutrients
    private Double fiberG;
    private Double sugarG;
    private Double sodiumMg;
    private Double calciumMg;
    private Double ironMg;
    private Double potassiumMg;
    private Double vitaminAMcg;
    private Double vitaminCMg;
    private Double vitaminDMcg;

    @Schema(example = "0.95")
    private Double confidence;

    @Schema(example = "Detected freshly sliced avocado on sourdough toast with poached eggs.")
    private String notes;
}
