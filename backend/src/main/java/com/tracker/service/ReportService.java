package com.tracker.service;

import com.tracker.config.CurrentUserProvider;
import com.tracker.dto.GoalVsActualResponse;
import com.tracker.dto.MacroReportResponse;
import com.tracker.dto.MicroReportResponse;
import com.tracker.dto.WeeklyCaloriesResponse;
import com.tracker.entity.Goal;
import com.tracker.exception.InvalidDateRangeException;
import com.tracker.repository.FoodEntryRepository;
import com.tracker.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final FoodEntryRepository foodEntryRepository;
    private final GoalRepository goalRepository;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Weekly Calorie Trend: 7 days of daily calories plus the goal's daily calories.
     * Aggregation happens in SQL via SUM(calories) GROUP BY entry_date.
     * Missing days in the 7-day period are filled with 0.
     */
    @Transactional(readOnly = true)
    public WeeklyCaloriesResponse getWeeklyCalories(LocalDate weekStart) {
        UUID userId = currentUserProvider.getCurrentUserId();

        LocalDate start = (weekStart != null)
                ? weekStart
                : LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate end = start.plusDays(6);

        // Fetch user's target daily calories
        Integer goalCalories = goalRepository.findByUserId(userId)
                .map(Goal::getDailyCalories)
                .orElse(null);

        // SQL aggregate
        List<FoodEntryRepository.DayCalorieProjection> projections =
                foodEntryRepository.findDailyCaloriesSum(userId, start, end);

        Map<LocalDate, Integer> dayMap = projections.stream()
                .collect(Collectors.toMap(
                        FoodEntryRepository.DayCalorieProjection::getEntryDate,
                        p -> p.getTotalCalories() != null ? p.getTotalCalories() : 0,
                        (existing, replacement) -> existing
                ));

        // Fill all 7 days so no gaps exist
        List<WeeklyCaloriesResponse.DayCalorieItem> dayItems = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = start.plusDays(i);
            dayItems.add(new WeeklyCaloriesResponse.DayCalorieItem(day, dayMap.getOrDefault(day, 0)));
        }

        return WeeklyCaloriesResponse.builder()
                .weekStart(start)
                .weekEnd(end)
                .goalCalories(goalCalories)
                .days(dayItems)
                .build();
    }

    /**
     * Macro Breakdown: Protein, Carbs, Fat totals per bucket (day or week).
     * Grouping and SUM calculation performed natively in PostgreSQL.
     */
    @Transactional(readOnly = true)
    public MacroReportResponse getMacros(LocalDate from, LocalDate to, String groupBy) {
        UUID userId = currentUserProvider.getCurrentUserId();

        LocalDate start = (from != null) ? from : LocalDate.now().minusDays(30);
        LocalDate end = (to != null) ? to : LocalDate.now();

        if (start.isAfter(end)) {
            throw new InvalidDateRangeException("The 'from' date (" + start + ") cannot be after 'to' date (" + end + ")");
        }

        String safeGroupBy = ("week".equalsIgnoreCase(groupBy)) ? "week" : "day";

        List<FoodEntryRepository.MacroProjection> projections;
        if ("week".equalsIgnoreCase(safeGroupBy)) {
            projections = foodEntryRepository.findMacrosGroupedByWeek(userId, start, end);
        } else {
            projections = foodEntryRepository.findMacrosGroupedByDay(userId, start, end);
        }

        List<MacroReportResponse.MacroBucketItem> buckets = projections.stream()
                .map(p -> MacroReportResponse.MacroBucketItem.builder()
                        .period(p.getBucket())
                        .proteinG(roundToOneDecimal(p.getProteinG()))
                        .carbsG(roundToOneDecimal(p.getCarbsG()))
                        .fatG(roundToOneDecimal(p.getFatG()))
                        .calories(p.getCalories() != null ? p.getCalories() : 0)
                        .build())
                .toList();

        return MacroReportResponse.builder()
                .from(start)
                .to(end)
                .groupBy(safeGroupBy)
                .buckets(buckets)
                .build();
    }

    /**
     * Micronutrient Summary: Daily totals first summed per day in SQL, then averaged over days with entries.
     */
    @Transactional(readOnly = true)
    public MicroReportResponse getMicros(LocalDate from, LocalDate to) {
        UUID userId = currentUserProvider.getCurrentUserId();

        LocalDate start = (from != null) ? from : LocalDate.now().minusDays(30);
        LocalDate end = (to != null) ? to : LocalDate.now();

        if (start.isAfter(end)) {
            throw new InvalidDateRangeException("The 'from' date (" + start + ") cannot be after 'to' date (" + end + ")");
        }

        FoodEntryRepository.MicroAveragesProjection avg = foodEntryRepository.findMicroAverages(userId, start, end);

        long activeDays = (avg != null && avg.getActiveDays() != null) ? avg.getActiveDays() : 0L;

        List<MicroReportResponse.MicroAverageItem> list = new ArrayList<>();
        list.add(new MicroReportResponse.MicroAverageItem("Dietary Fiber", roundToOneDecimal(avg != null ? avg.getAvgFiber() : 0.0), "g"));
        list.add(new MicroReportResponse.MicroAverageItem("Sugar", roundToOneDecimal(avg != null ? avg.getAvgSugar() : 0.0), "g"));
        list.add(new MicroReportResponse.MicroAverageItem("Sodium", roundToOneDecimal(avg != null ? avg.getAvgSodium() : 0.0), "mg"));
        list.add(new MicroReportResponse.MicroAverageItem("Calcium", roundToOneDecimal(avg != null ? avg.getAvgCalcium() : 0.0), "mg"));
        list.add(new MicroReportResponse.MicroAverageItem("Iron", roundToOneDecimal(avg != null ? avg.getAvgIron() : 0.0), "mg"));
        list.add(new MicroReportResponse.MicroAverageItem("Potassium", roundToOneDecimal(avg != null ? avg.getAvgPotassium() : 0.0), "mg"));
        list.add(new MicroReportResponse.MicroAverageItem("Vitamin A", roundToOneDecimal(avg != null ? avg.getAvgVitaminA() : 0.0), "mcg"));
        list.add(new MicroReportResponse.MicroAverageItem("Vitamin C", roundToOneDecimal(avg != null ? avg.getAvgVitaminC() : 0.0), "mg"));
        list.add(new MicroReportResponse.MicroAverageItem("Vitamin D", roundToOneDecimal(avg != null ? avg.getAvgVitaminD() : 0.0), "mcg"));

        return MicroReportResponse.builder()
                .from(start)
                .to(end)
                .activeDaysCount(activeDays)
                .nutrients(list)
                .build();
    }

    /**
     * Goal vs. Actual: Average daily calories and macros divided by set targets, returned as a percentage.
     * If no goal exists, returns actuals only.
     */
    @Transactional(readOnly = true)
    public GoalVsActualResponse getGoalVsActual(LocalDate from, LocalDate to) {
        UUID userId = currentUserProvider.getCurrentUserId();

        LocalDate start = (from != null) ? from : LocalDate.now().minusDays(30);
        LocalDate end = (to != null) ? to : LocalDate.now();

        if (start.isAfter(end)) {
            throw new InvalidDateRangeException("The 'from' date (" + start + ") cannot be after 'to' date (" + end + ")");
        }

        // Fetch actual SQL averages of daily sums
        FoodEntryRepository.ActualAveragesProjection actual = foodEntryRepository.findActualAverages(userId, start, end);
        Optional<Goal> goalOpt = goalRepository.findByUserId(userId);

        double actualCal = (actual != null && actual.getAvgCalories() != null) ? actual.getAvgCalories() : 0.0;
        double actualP = (actual != null && actual.getAvgProtein() != null) ? actual.getAvgProtein() : 0.0;
        double actualC = (actual != null && actual.getAvgCarbs() != null) ? actual.getAvgCarbs() : 0.0;
        double actualF = (actual != null && actual.getAvgFat() != null) ? actual.getAvgFat() : 0.0;

        List<GoalVsActualResponse.MetricComparison> comparisons = new ArrayList<>();

        if (goalOpt.isPresent()) {
            Goal goal = goalOpt.get();
            double targetCal = goal.getDailyCalories() != null ? goal.getDailyCalories().doubleValue() : 0.0;
            double targetP = goal.getProteinG() != null ? goal.getProteinG() : 0.0;
            double targetC = goal.getCarbsG() != null ? goal.getCarbsG() : 0.0;
            double targetF = goal.getFatG() != null ? goal.getFatG() : 0.0;

            comparisons.add(new GoalVsActualResponse.MetricComparison(
                    "Calories",
                    roundToOneDecimal(actualCal),
                    targetCal,
                    "kcal",
                    calcPercentage(actualCal, targetCal)
            ));
            comparisons.add(new GoalVsActualResponse.MetricComparison(
                    "Protein",
                    roundToOneDecimal(actualP),
                    targetP,
                    "g",
                    calcPercentage(actualP, targetP)
            ));
            comparisons.add(new GoalVsActualResponse.MetricComparison(
                    "Carbohydrates",
                    roundToOneDecimal(actualC),
                    targetC,
                    "g",
                    calcPercentage(actualC, targetC)
            ));
            comparisons.add(new GoalVsActualResponse.MetricComparison(
                    "Fat",
                    roundToOneDecimal(actualF),
                    targetF,
                    "g",
                    calcPercentage(actualF, targetF)
            ));

            return GoalVsActualResponse.builder()
                    .from(start)
                    .to(end)
                    .hasGoal(true)
                    .metrics(comparisons)
                    .build();
        } else {
            // Actuals only when no goal is set
            comparisons.add(new GoalVsActualResponse.MetricComparison("Calories", roundToOneDecimal(actualCal), null, "kcal", null));
            comparisons.add(new GoalVsActualResponse.MetricComparison("Protein", roundToOneDecimal(actualP), null, "g", null));
            comparisons.add(new GoalVsActualResponse.MetricComparison("Carbohydrates", roundToOneDecimal(actualC), null, "g", null));
            comparisons.add(new GoalVsActualResponse.MetricComparison("Fat", roundToOneDecimal(actualF), null, "g", null));

            return GoalVsActualResponse.builder()
                    .from(start)
                    .to(end)
                    .hasGoal(false)
                    .metrics(comparisons)
                    .build();
        }
    }

    private Double roundToOneDecimal(Double val) {
        if (val == null) return 0.0;
        return Math.round(val * 10.0) / 10.0;
    }

    private Double calcPercentage(double actual, double target) {
        if (target <= 0.0) return 0.0;
        return Math.round((actual / target) * 1000.0) / 10.0;
    }
}
