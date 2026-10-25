package com.tracker.service;

import com.tracker.config.CurrentUserProvider;
import com.tracker.dto.GoalRequest;
import com.tracker.dto.GoalResponse;
import com.tracker.entity.Goal;
import com.tracker.entity.User;
import com.tracker.exception.ResourceNotFoundException;
import com.tracker.mapper.GoalMapper;
import com.tracker.repository.GoalRepository;
import com.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;
    private final GoalMapper goalMapper;

    @Transactional(readOnly = true)
    public Optional<GoalResponse> getGoals() {
        UUID userId = currentUserProvider.getCurrentUserId();
        return goalRepository.findByUserId(userId)
                .map(goalMapper::toResponse);
    }

    @Transactional
    public GoalResponse createOrUpdateGoals(GoalRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(User.builder().id(userId).name("Default User").build()));

        Goal goal = goalRepository.findByUserId(userId)
                .map(existing -> {
                    goalMapper.updateEntityFromRequest(existing, request);
                    return existing;
                })
                .orElseGet(() -> goalMapper.toEntity(request, user));

        Goal saved = goalRepository.save(goal);
        return goalMapper.toResponse(saved);
    }
}
