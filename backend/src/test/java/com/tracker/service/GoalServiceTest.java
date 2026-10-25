package com.tracker.service;

import com.tracker.config.CurrentUserProvider;
import com.tracker.dto.GoalRequest;
import com.tracker.dto.GoalResponse;
import com.tracker.entity.Goal;
import com.tracker.entity.User;
import com.tracker.mapper.GoalMapper;
import com.tracker.repository.GoalRepository;
import com.tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Spy
    private GoalMapper goalMapper = new GoalMapper();

    @InjectMocks
    private GoalService goalService;

    private UUID userId;
    private User user;

    @BeforeEach
    void setUp() {
        userId = CurrentUserProvider.DEFAULT_USER_ID;
        user = User.builder().id(userId).name("Test User").build();
        lenient().when(currentUserProvider.getCurrentUserId()).thenReturn(userId);
    }

    @Test
    void testGetGoals_WhenExists() {
        Goal goal = Goal.builder()
                .id(UUID.randomUUID())
                .user(user)
                .dailyCalories(2100)
                .proteinG(140.0)
                .carbsG(220.0)
                .fatG(65.0)
                .currentWeightKg(75.0)
                .targetWeightKg(70.0)
                .build();

        when(goalRepository.findByUserId(userId)).thenReturn(Optional.of(goal));

        Optional<GoalResponse> response = goalService.getGoals();

        assertTrue(response.isPresent());
        assertEquals(2100, response.get().getDailyCalories());
        assertEquals(140.0, response.get().getProteinG());
    }

    @Test
    void testGetGoals_WhenNone_ReturnsEmpty() {
        when(goalRepository.findByUserId(userId)).thenReturn(Optional.empty());

        Optional<GoalResponse> response = goalService.getGoals();

        assertFalse(response.isPresent());
    }

    @Test
    void testCreateOrUpdateGoals_CreatesNew() {
        GoalRequest request = GoalRequest.builder()
                .dailyCalories(2200)
                .proteinG(150.0)
                .carbsG(230.0)
                .fatG(70.0)
                .currentWeightKg(76.0)
                .targetWeightKg(72.0)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(goalRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(goalRepository.save(any(Goal.class))).thenAnswer(i -> {
            Goal g = i.getArgument(0);
            g.setId(UUID.randomUUID());
            return g;
        });

        GoalResponse response = goalService.createOrUpdateGoals(request);

        assertNotNull(response);
        assertEquals(2200, response.getDailyCalories());
        verify(goalRepository, times(1)).save(any(Goal.class));
    }
}
