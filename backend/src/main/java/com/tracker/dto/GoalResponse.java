package com.tracker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing user nutrition goals")
public class GoalResponse {
    private UUID id;
    private Integer dailyCalories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private Double currentWeightKg;
    private Double targetWeightKg;
    private OffsetDateTime updatedAt;
}
