package com.tracker.service;

import com.tracker.config.CurrentUserProvider;
import com.tracker.dto.EntryRequest;
import com.tracker.dto.EntryResponse;
import com.tracker.entity.FoodEntry;
import com.tracker.entity.MealType;
import com.tracker.entity.User;
import com.tracker.exception.InvalidDateRangeException;
import com.tracker.exception.ResourceNotFoundException;
import com.tracker.mapper.EntryMapper;
import com.tracker.repository.FoodEntryRepository;
import com.tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

    @Mock
    private FoodEntryRepository foodEntryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Spy
    private EntryMapper entryMapper = new EntryMapper();

    @InjectMocks
    private EntryService entryService;

    private UUID userId;
    private User user;

    @BeforeEach
    void setUp() {
        userId = CurrentUserProvider.DEFAULT_USER_ID;
        user = User.builder().id(userId).name("Test User").build();
        lenient().when(currentUserProvider.getCurrentUserId()).thenReturn(userId);
    }

    @Test
    void testCreateEntry() {
        EntryRequest request = EntryRequest.builder()
                .entryDate(LocalDate.now())
                .mealType(MealType.BREAKFAST)
                .foodName("Oatmeal & Honey")
                .quantity(1.0)
                .unit("bowl")
                .calories(320)
                .proteinG(12.0)
                .carbsG(54.0)
                .fatG(6.0)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(foodEntryRepository.save(any(FoodEntry.class))).thenAnswer(i -> {
            FoodEntry e = i.getArgument(0);
            e.setId(UUID.randomUUID());
            return e;
        });

        EntryResponse response = entryService.createEntry(request);

        assertNotNull(response);
        assertEquals("Oatmeal & Honey", response.getFoodName());
        assertEquals(320, response.getCalories());
    }

    @Test
    void testGetEntryById_NotFound_ThrowsException() {
        UUID randomId = UUID.randomUUID();
        when(foodEntryRepository.findByIdAndUserId(randomId, userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> entryService.getEntryById(randomId));
    }

    @Test
    void testGetEntries_InvalidDateRange_ThrowsException() {
        LocalDate from = LocalDate.now().plusDays(5);
        LocalDate to = LocalDate.now();

        assertThrows(InvalidDateRangeException.class, () ->
                entryService.getEntries(from, to, null, 0, 20)
        );
    }
}
