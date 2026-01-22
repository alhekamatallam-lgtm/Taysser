
import { mockUsers } from '../data/mockData';
import type { User } from '../types';

const USER_SESSION_KEY = 'quran_app_user';

export function login(username: string, password_raw: string): User | null {
    const user = mockUsers.find(u => u.username === username && u.password === password_raw);
    if (user) {
        // In a real app, don't store the password in the session
        const { password, ...userToStore } = user;
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
        return userToStore;
    }
    return null;
}

export function logout(): void {
    sessionStorage.removeItem(USER_SESSION_KEY);
}

export function getCurrentUser(): User | null {
    const userJson = sessionStorage.getItem(USER_SESSION_KEY);
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error("Failed to parse user from session storage", e);
            return null;
        }
    }
    return null;
}
