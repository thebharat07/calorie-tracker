package com.tracker.config;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Provides the current authenticated user's ID.
 * Defaults to the seeded demo user so all services are user-scoped.
 * Real auth (e.g. Supabase JWT) can be plugged in by modifying only this class.
 */
@Component
public class CurrentUserProvider {

    public static final UUID DEFAULT_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    public UUID getCurrentUserId() {
        return DEFAULT_USER_ID;
    }
}
