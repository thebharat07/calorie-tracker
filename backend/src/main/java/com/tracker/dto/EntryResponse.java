package com.tracker.dto;

import com.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing food entry details")
public class EntryResponse {
    private UUID id;
    private LocalDate entryDate;
    private MealType mealType;
    private String foodName;
    private Double quantity;
    private String unit;
    private Integer calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;

    // Micronutrients
    private Double fiberG;
    private Double sugarG;
    private Double sodiumMg;
    private Double calciumMg;
    private Double ironMg;
    private Double potassiumMg;
    private Double vitaminAMcg;
    private Double vitaminCMg;
    private Double vitaminDMcg;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
