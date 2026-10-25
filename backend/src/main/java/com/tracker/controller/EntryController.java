package com.tracker.controller;

import com.tracker.dto.EntryRequest;
import com.tracker.dto.EntryResponse;
import com.tracker.dto.PagedResponse;
import com.tracker.entity.MealType;
import com.tracker.service.EntryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
@Tag(name = "Food Entries", description = "Endpoints for logging, updating, filtering, and deleting meals")
public class EntryController {

    private final EntryService entryService;

    @PostMapping
    @Operation(summary = "Create food entry", description = "Logs a new meal with portion, macros, and optional micronutrients")
    public ResponseEntity<EntryResponse> createEntry(@Valid @RequestBody EntryRequest request) {
        EntryResponse created = entryService.createEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List food entries with filtering and pagination", description = "Filters by date range and meal category with pagination (default: page 0, size 20, max size 100)")
    public ResponseEntity<PagedResponse<EntryResponse>> getEntries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) MealType mealType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PagedResponse<EntryResponse> response = entryService.getEntries(from, to, mealType, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single food entry", description = "Retrieves details of a food entry by its UUID")
    public ResponseEntity<EntryResponse> getEntryById(@PathVariable UUID id) {
        EntryResponse response = entryService.getEntryById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update food entry", description = "Updates food name, portion, or nutritional details")
    public ResponseEntity<EntryResponse> updateEntry(
            @PathVariable UUID id,
            @Valid @RequestBody EntryRequest request
    ) {
        EntryResponse updated = entryService.updateEntry(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete food entry", description = "Deletes a meal record by its UUID")
    public ResponseEntity<Void> deleteEntry(@PathVariable UUID id) {
        entryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
