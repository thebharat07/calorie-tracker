package com.tracker.controller;

import com.tracker.dto.GoalRequest;
import com.tracker.dto.GoalResponse;
import com.tracker.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@Tag(name = "Goals", description = "Endpoints for retrieving and configuring nutritional goals")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    @Operation(summary = "Get user nutrition goals", description = "Returns the currently configured goals, or 404 if no goals are set")
    public ResponseEntity<GoalResponse> getGoals() {
        return goalService.getGoals()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    @Operation(summary = "Create or update nutrition goals", description = "Upserts daily calorie, macronutrient, and target weight goals")
    public ResponseEntity<GoalResponse> createOrUpdateGoals(@Valid @RequestBody GoalRequest request) {
        GoalResponse response = goalService.createOrUpdateGoals(request);
        return ResponseEntity.ok(response);
    }
}
