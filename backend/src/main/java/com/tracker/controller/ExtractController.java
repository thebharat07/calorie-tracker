package com.tracker.controller;

import com.tracker.dto.NutritionExtractionResponse;
import com.tracker.service.AiExtractionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/extract")
@RequiredArgsConstructor
@Tag(name = "AI Extraction", description = "Endpoints for analyzing meal photos using Google Gemini Vision")
public class ExtractController {

    private final AiExtractionService aiExtractionService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Extract nutrition from meal photo", description = "Accepts a meal image (JPEG, PNG, WebP up to 5MB), sends to Google Gemini Vision, and returns parsed nutrition JSON")
    public ResponseEntity<NutritionExtractionResponse> extractFromImage(@RequestParam("file") MultipartFile file) {
        NutritionExtractionResponse response = aiExtractionService.extractNutritionFromImage(file);
        return ResponseEntity.ok(response);
    }
}
