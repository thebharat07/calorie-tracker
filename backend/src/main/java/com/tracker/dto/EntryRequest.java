package com.tracker.dto;

import com.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for creating or updating a food entry")
public class EntryRequest {

    @NotNull(message = "Entry date is required")
    @Schema(example = "2026-10-25", description = "Date of consumption")
    private LocalDate entryDate;

    @NotNull(message = "Meal type is required (BREAKFAST, LUNCH, DINNER, SNACK)")
    @Schema(example = "BREAKFAST", description = "Category of meal")
    private MealType mealType;

    @NotBlank(message = "Food name is required")
    @Size(max = 255, message = "Food name cannot exceed 255 characters")
    @Schema(example = "Avocado Toast & Poached Eggs", description = "Name of food or dish")
    private String foodName;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    @Schema(example = "2.0", description = "Portion amount")
    private Double quantity;

    @NotBlank(message = "Unit is required")
    @Size(max = 50, message = "Unit cannot exceed 50 characters")
    @Schema(example = "slices", description = "Serving measurement unit")
    private String unit;

    @NotNull(message = "Calories value is required")
    @PositiveOrZero(message = "Calories must be 0 or positive")
    @Schema(example = "420", description = "Total caloric energy in kcal")
    private Integer calories;

    @NotNull(message = "Protein is required")
    @PositiveOrZero(message = "Protein must be 0 or positive")
    @Schema(example = "19.0", description = "Protein in grams")
    private Double proteinG;

    @NotNull(message = "Carbs is required")
    @PositiveOrZero(message = "Carbs must be 0 or positive")
    @Schema(example = "34.0", description = "Carbohydrates in grams")
    private Double carbsG;

    @NotNull(message = "Fat is required")
    @PositiveOrZero(message = "Fat must be 0 or positive")
    @Schema(example = "22.0", description = "Fat in grams")
    private Double fatG;

    // Optional Micronutrients
    @PositiveOrZero(message = "Fiber must be 0 or positive")
    private Double fiberG;

    @PositiveOrZero(message = "Sugar must be 0 or positive")
    private Double sugarG;

    @PositiveOrZero(message = "Sodium must be 0 or positive")
    private Double sodiumMg;

    @PositiveOrZero(message = "Calcium must be 0 or positive")
    private Double calciumMg;

    @PositiveOrZero(message = "Iron must be 0 or positive")
    private Double ironMg;

    @PositiveOrZero(message = "Potassium must be 0 or positive")
    private Double potassiumMg;

    @PositiveOrZero(message = "Vitamin A must be 0 or positive")
    private Double vitaminAMcg;

    @PositiveOrZero(message = "Vitamin C must be 0 or positive")
    private Double vitaminCMg;

    @PositiveOrZero(message = "Vitamin D must be 0 or positive")
    private Double vitaminDMcg;
}
