package com.tracker.mapper;

import com.tracker.dto.EntryRequest;
import com.tracker.dto.EntryResponse;
import com.tracker.entity.FoodEntry;
import com.tracker.entity.User;
import org.springframework.stereotype.Component;

@Component
public class EntryMapper {

    public FoodEntry toEntity(EntryRequest request, User user) {
        if (request == null) return null;
        return FoodEntry.builder()
                .user(user)
                .entryDate(request.getEntryDate())
                .mealType(request.getMealType())
                .foodName(request.getFoodName().trim())
                .quantity(request.getQuantity())
                .unit(request.getUnit().trim())
                .calories(request.getCalories())
                .proteinG(request.getProteinG())
                .carbsG(request.getCarbsG())
                .fatG(request.getFatG())
                .fiberG(request.getFiberG())
                .sugarG(request.getSugarG())
                .sodiumMg(request.getSodiumMg())
                .calciumMg(request.getCalciumMg())
                .ironMg(request.getIronMg())
                .potassiumMg(request.getPotassiumMg())
                .vitaminAMcg(request.getVitaminAMcg())
                .vitaminCMg(request.getVitaminCMg())
                .vitaminDMcg(request.getVitaminDMcg())
                .build();
    }

    public void updateEntityFromRequest(FoodEntry entry, EntryRequest request) {
        if (entry == null || request == null) return;
        entry.setEntryDate(request.getEntryDate());
        entry.setMealType(request.getMealType());
        entry.setFoodName(request.getFoodName().trim());
        entry.setQuantity(request.getQuantity());
        entry.setUnit(request.getUnit().trim());
        entry.setCalories(request.getCalories());
        entry.setProteinG(request.getProteinG());
        entry.setCarbsG(request.getCarbsG());
        entry.setFatG(request.getFatG());
        entry.setFiberG(request.getFiberG());
        entry.setSugarG(request.getSugarG());
        entry.setSodiumMg(request.getSodiumMg());
        entry.setCalciumMg(request.getCalciumMg());
        entry.setIronMg(request.getIronMg());
        entry.setPotassiumMg(request.getPotassiumMg());
        entry.setVitaminAMcg(request.getVitaminAMcg());
        entry.setVitaminCMg(request.getVitaminCMg());
        entry.setVitaminDMcg(request.getVitaminDMcg());
    }

    public EntryResponse toResponse(FoodEntry entry) {
        if (entry == null) return null;
        return EntryResponse.builder()
                .id(entry.getId())
                .entryDate(entry.getEntryDate())
                .mealType(entry.getMealType())
                .foodName(entry.getFoodName())
                .quantity(entry.getQuantity())
                .unit(entry.getUnit())
                .calories(entry.getCalories())
                .proteinG(entry.getProteinG())
                .carbsG(entry.getCarbsG())
                .fatG(entry.getFatG())
                .fiberG(entry.getFiberG())
                .sugarG(entry.getSugarG())
                .sodiumMg(entry.getSodiumMg())
                .calciumMg(entry.getCalciumMg())
                .ironMg(entry.getIronMg())
                .potassiumMg(entry.getPotassiumMg())
                .vitaminAMcg(entry.getVitaminAMcg())
                .vitaminCMg(entry.getVitaminCMg())
                .vitaminDMcg(entry.getVitaminDMcg())
                .createdAt(entry.getCreatedAt())
                .updatedAt(entry.getUpdatedAt())
                .build();
    }
}
