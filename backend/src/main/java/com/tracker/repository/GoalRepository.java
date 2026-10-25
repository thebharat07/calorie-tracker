package com.tracker.repository;

import com.tracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {
    Optional<Goal> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
}
