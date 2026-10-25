package com.tracker.mapper;

import com.tracker.dto.GoalRequest;
import com.tracker.dto.GoalResponse;
import com.tracker.entity.Goal;
import com.tracker.entity.User;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public Goal toEntity(GoalRequest request, User user) {
        if (request == null) return null;
        return Goal.builder()
                .user(user)
                .dailyCalories(request.getDailyCalories())
                .proteinG(request.getProteinG())
                .carbsG(request.getCarbsG())
                .fatG(request.getFatG())
                .currentWeightKg(request.getCurrentWeightKg())
                .targetWeightKg(request.getTargetWeightKg())
                .build();
    }

    public void updateEntityFromRequest(Goal goal, GoalRequest request) {
        if (goal == null || request == null) return;
        goal.setDailyCalories(request.getDailyCalories());
        goal.setProteinG(request.getProteinG());
        goal.setCarbsG(request.getCarbsG());
        goal.setFatG(request.getFatG());
        goal.setCurrentWeightKg(request.getCurrentWeightKg());
        goal.setTargetWeightKg(request.getTargetWeightKg());
    }

    public GoalResponse toResponse(Goal goal) {
        if (goal == null) return null;
        return GoalResponse.builder()
                .id(goal.getId())
                .dailyCalories(goal.getDailyCalories())
                .proteinG(goal.getProteinG())
                .carbsG(goal.getCarbsG())
                .fatG(goal.getFatG())
                .currentWeightKg(goal.getCurrentWeightKg())
                .targetWeightKg(goal.getTargetWeightKg())
                .updatedAt(goal.getUpdatedAt())
                .build();
    }
}
