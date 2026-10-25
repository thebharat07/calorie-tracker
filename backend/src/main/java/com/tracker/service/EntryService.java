package com.tracker.service;

import com.tracker.config.CurrentUserProvider;
import com.tracker.dto.EntryRequest;
import com.tracker.dto.EntryResponse;
import com.tracker.dto.PagedResponse;
import com.tracker.entity.FoodEntry;
import com.tracker.entity.MealType;
import com.tracker.entity.User;
import com.tracker.exception.InvalidDateRangeException;
import com.tracker.exception.ResourceNotFoundException;
import com.tracker.mapper.EntryMapper;
import com.tracker.repository.FoodEntryRepository;
import com.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final FoodEntryRepository foodEntryRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;
    private final EntryMapper entryMapper;

    @Transactional
    public EntryResponse createEntry(EntryRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(User.builder().id(userId).name("Default User").build()));

        FoodEntry entity = entryMapper.toEntity(request, user);
        FoodEntry saved = foodEntryRepository.save(entity);
        return entryMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EntryResponse getEntryById(UUID id) {
        UUID userId = currentUserProvider.getCurrentUserId();
        FoodEntry entry = foodEntryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Food entry not found with id: " + id));
        return entryMapper.toResponse(entry);
    }

    @Transactional
    public EntryResponse updateEntry(UUID id, EntryRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        FoodEntry entry = foodEntryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Food entry not found with id: " + id));

        entryMapper.updateEntityFromRequest(entry, request);
        FoodEntry updated = foodEntryRepository.save(entry);
        return entryMapper.toResponse(updated);
    }

    @Transactional
    public void deleteEntry(UUID id) {
        UUID userId = currentUserProvider.getCurrentUserId();
        FoodEntry entry = foodEntryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Food entry not found with id: " + id));
        foodEntryRepository.delete(entry);
    }

    @Transactional(readOnly = true)
    public PagedResponse<EntryResponse> getEntries(
            LocalDate from,
            LocalDate to,
            MealType mealType,
            int page,
            int size
    ) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new InvalidDateRangeException("The 'from' date (" + from + ") cannot be after 'to' date (" + to + ")");
        }

        // Clamp page parameters
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100);

        Pageable pageable = PageRequest.of(safePage, safeSize);
        UUID userId = currentUserProvider.getCurrentUserId();

        Page<FoodEntry> entriesPage = foodEntryRepository.findByUserAndDateRange(
                userId,
                from,
                to,
                mealType,
                pageable
        );

        Page<EntryResponse> dtoPage = entriesPage.map(entryMapper::toResponse);
        return PagedResponse.fromPage(dtoPage);
    }
}
