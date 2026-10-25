package com.tracker.repository;

import com.tracker.entity.FoodEntry;
import com.tracker.entity.MealType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FoodEntryRepository extends JpaRepository<FoodEntry, UUID> {

    Optional<FoodEntry> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT e FROM FoodEntry e WHERE e.user.id = :userId " +
           "AND (:from IS NULL OR e.entryDate >= :from) " +
           "AND (:to IS NULL OR e.entryDate <= :to) " +
           "AND (:mealType IS NULL OR e.mealType = :mealType) " +
           "ORDER BY e.entryDate DESC, " +
           "CASE e.mealType " +
           "  WHEN com.tracker.entity.MealType.BREAKFAST THEN 1 " +
           "  WHEN com.tracker.entity.MealType.LUNCH THEN 2 " +
           "  WHEN com.tracker.entity.MealType.DINNER THEN 3 " +
           "  WHEN com.tracker.entity.MealType.SNACK THEN 4 " +
           "  ELSE 5 END ASC")
    Page<FoodEntry> findByUserAndDateRange(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("mealType") MealType mealType,
            Pageable pageable
    );

    // B4: Weekly Calories Report SQL Aggregation
    interface DayCalorieProjection {
        LocalDate getEntryDate();
        Integer getTotalCalories();
    }

    @Query("SELECT e.entryDate AS entryDate, CAST(SUM(e.calories) AS integer) AS totalCalories " +
           "FROM FoodEntry e " +
           "WHERE e.user.id = :userId AND e.entryDate BETWEEN :from AND :to " +
           "GROUP BY e.entryDate ORDER BY e.entryDate ASC")
    List<DayCalorieProjection> findDailyCaloriesSum(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    // B4: Macros Aggregations (Grouped by Day or Week)
    interface MacroProjection {
        String getBucket();
        Double getProteinG();
        Double getCarbsG();
        Double getFatG();
        Integer getCalories();
    }

    @Query(value = "SELECT CAST(entry_date AS VARCHAR) AS bucket, " +
                   "COALESCE(SUM(protein_g), 0.0) AS proteinG, " +
                   "COALESCE(SUM(carbs_g), 0.0) AS carbsG, " +
                   "COALESCE(SUM(fat_g), 0.0) AS fatG, " +
                   "CAST(COALESCE(SUM(calories), 0) AS INTEGER) AS calories " +
                   "FROM food_entries " +
                   "WHERE user_id = :userId AND entry_date BETWEEN :from AND :to " +
                   "GROUP BY entry_date ORDER BY entry_date ASC", nativeQuery = true)
    List<MacroProjection> findMacrosGroupedByDay(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    @Query(value = "SELECT CAST(CAST(date_trunc('week', entry_date) AS DATE) AS VARCHAR) AS bucket, " +
                   "COALESCE(SUM(protein_g), 0.0) AS proteinG, " +
                   "COALESCE(SUM(carbs_g), 0.0) AS carbsG, " +
                   "COALESCE(SUM(fat_g), 0.0) AS fatG, " +
                   "CAST(COALESCE(SUM(calories), 0) AS INTEGER) AS calories " +
                   "FROM food_entries " +
                   "WHERE user_id = :userId AND entry_date BETWEEN :from AND :to " +
                   "GROUP BY date_trunc('week', entry_date) ORDER BY bucket ASC", nativeQuery = true)
    List<MacroProjection> findMacrosGroupedByWeek(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    // B4: Micros Daily Aggregations (First sum per day, then average across active days)
    interface MicroAveragesProjection {
        Long getActiveDays();
        Double getAvgFiber();
        Double getAvgSugar();
        Double getAvgSodium();
        Double getAvgCalcium();
        Double getAvgIron();
        Double getAvgPotassium();
        Double getAvgVitaminA();
        Double getAvgVitaminC();
        Double getAvgVitaminD();
    }

    @Query(value = "WITH daily_sums AS (" +
                   "  SELECT entry_date, " +
                   "         SUM(fiber_g) as d_fiber, " +
                   "         SUM(sugar_g) as d_sugar, " +
                   "         SUM(sodium_mg) as d_sodium, " +
                   "         SUM(calcium_mg) as d_calcium, " +
                   "         SUM(iron_mg) as d_iron, " +
                   "         SUM(potassium_mg) as d_potassium, " +
                   "         SUM(vitamin_a_mcg) as d_vit_a, " +
                   "         SUM(vitamin_c_mg) as d_vit_c, " +
                   "         SUM(vitamin_d_mcg) as d_vit_d " +
                   "  FROM food_entries " +
                   "  WHERE user_id = :userId AND entry_date BETWEEN :from AND :to " +
                   "  GROUP BY entry_date" +
                   ") " +
                   "SELECT " +
                   "  COUNT(*) as activeDays, " +
                   "  AVG(d_fiber) as avgFiber, " +
                   "  AVG(d_sugar) as avgSugar, " +
                   "  AVG(d_sodium) as avgSodium, " +
                   "  AVG(d_calcium) as avgCalcium, " +
                   "  AVG(d_iron) as avgIron, " +
                   "  AVG(d_potassium) as avgPotassium, " +
                   "  AVG(d_vit_a) as avgVitaminA, " +
                   "  AVG(d_vit_c) as avgVitaminC, " +
                   "  AVG(d_vit_d) as avgVitaminD " +
                   "FROM daily_sums", nativeQuery = true)
    MicroAveragesProjection findMicroAverages(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    // B4: Goal vs Actual Aggregations (Averages of daily sums)
    interface ActualAveragesProjection {
        Long getActiveDays();
        Double getAvgCalories();
        Double getAvgProtein();
        Double getAvgCarbs();
        Double getAvgFat();
    }

    @Query(value = "WITH daily_sums AS (" +
                   "  SELECT entry_date, " +
                   "         SUM(calories) as d_cal, " +
                   "         SUM(protein_g) as d_p, " +
                   "         SUM(carbs_g) as d_c, " +
                   "         SUM(fat_g) as d_f " +
                   "  FROM food_entries " +
                   "  WHERE user_id = :userId AND entry_date BETWEEN :from AND :to " +
                   "  GROUP BY entry_date" +
                   ") " +
                   "SELECT " +
                   "  COUNT(*) as activeDays, " +
                   "  AVG(d_cal) as avgCalories, " +
                   "  AVG(d_p) as avgProtein, " +
                   "  AVG(d_c) as avgCarbs, " +
                   "  AVG(d_f) as avgFat " +
                   "FROM daily_sums", nativeQuery = true)
    ActualAveragesProjection findActualAverages(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
