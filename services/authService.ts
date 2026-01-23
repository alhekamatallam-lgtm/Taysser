
import { mockUsers } from '../data/mockData';
import type { User } from '../types';

const USER_SESSION_KEY = 'tayseer_prod_session';

export function login(username: string, password_raw: string): User | null {
    const user = mockUsers.find(u => u.username === username && u.password === password_raw);
    if (user) {
        const { password, ...userToStore } = user;
        // Using localStorage for production persistence
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
        return userToStore;
    }
    return null;
}

export function logout(): void {
    localStorage.removeItem(USER_SESSION_KEY);
}

export function getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_SESSION_KEY);
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            return null;
        }
    }
    return null;
}
