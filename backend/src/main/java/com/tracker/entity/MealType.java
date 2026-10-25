package com.tracker.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MealType {
    BREAKFAST,
    LUNCH,
    DINNER,
    SNACK;

    @JsonCreator
    public static MealType fromString(String value) {
        if (value == null) {
            return null;
        }
        try {
            return MealType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid meal type: " + value + ". Allowed: BREAKFAST, LUNCH, DINNER, SNACK");
        }
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
