package com.tracker.controller;

import com.tracker.dto.GoalVsActualResponse;
import com.tracker.dto.MacroReportResponse;
import com.tracker.dto.MicroReportResponse;
import com.tracker.dto.WeeklyCaloriesResponse;
import com.tracker.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for nutrition analytics and SQL-aggregated reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/weekly-calories")
    @Operation(summary = "Get weekly calories trend", description = "Returns 7 days of calories starting at weekStart, with missing days zero-filled, plus target daily calories")
    public ResponseEntity<WeeklyCaloriesResponse> getWeeklyCalories(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart
    ) {
        WeeklyCaloriesResponse response = reportService.getWeeklyCalories(weekStart);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/macros")
    @Operation(summary = "Get macro breakdown", description = "Returns protein, carbs, and fat totals grouped by day or week (groupBy=day|week)")
    public ResponseEntity<MacroReportResponse> getMacros(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "day") String groupBy
    ) {
        MacroReportResponse response = reportService.getMacros(from, to, groupBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/micros")
    @Operation(summary = "Get micronutrient summary", description = "Returns daily average vitamins and minerals over the active days within the date range")
    public ResponseEntity<MicroReportResponse> getMicros(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        MicroReportResponse response = reportService.getMicros(from, to);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/goal-vs-actual")
    @Operation(summary = "Get goal vs actual comparison", description = "Compares average daily calories and macros against targets with percentage achieved")
    public ResponseEntity<GoalVsActualResponse> getGoalVsActual(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        GoalVsActualResponse response = reportService.getGoalVsActual(from, to);
        return ResponseEntity.ok(response);
    }
}
