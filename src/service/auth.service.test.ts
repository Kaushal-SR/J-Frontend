import { describe, it, expect } from 'vitest';
import { AuthService } from '../service/auth.service';

describe('AuthService', () => {
    it('should create a user', () => {
        const authService = new AuthService();
        const user = authService.createUser('test@example.com', 'password123');
        expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should authenticate a user', () => {
        const authService = new AuthService();
        authService.createUser('test@example.com', 'password123');
        const isAuthenticated = authService.authenticate('test@example.com', 'password123');
        expect(isAuthenticated).toBe(true);
    });

    it('should not authenticate a user with wrong password', () => {
        const authService = new AuthService();
        authService.createUser('test@example.com', 'password123');
        const isAuthenticated = authService.authenticate('test@example.com', 'wrongpassword');
        expect(isAuthenticated).toBe(false);
    });
});