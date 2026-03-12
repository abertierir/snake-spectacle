import { AuthResponse, GameMode, LeaderboardEntry, LivePlayer, SubmitScorePayload, User } from './types';

// --- API Helper ---
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            // Handle FastAPI standard validation error format
            if (errorData.detail && typeof errorData.detail === 'string') {
                errorMessage = errorData.detail;
            } else if (errorData.detail && Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
            }
        } catch (e) {
            errorMessage = response.statusText || 'Unknown error';
        }
        throw new Error(errorMessage);
    }

    // Return null if there's no content to parse
    if (response.status === 204) {
        return null as any;
    }

    return response.json();
}

// --- Auth API ---
export const authApi = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetchApi<AuthResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            return response;
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    async signup(username: string, email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetchApi<AuthResponse>('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
            return response;
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    async logout(): Promise<void> {
        try {
            await fetchApi('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            return await fetchApi<User>('/auth/me');
        } catch (error) {
            return null;
        }
    },
};

// --- Leaderboard API ---
export const leaderboardApi = {
    async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
        const url = mode ? `/leaderboard?mode=${mode}` : '/leaderboard';
        return await fetchApi<LeaderboardEntry[]>(url);
    },

    async submitScore(payload: SubmitScorePayload): Promise<LeaderboardEntry> {
        return await fetchApi<LeaderboardEntry>('/leaderboard', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};

// --- Live Players API ---
export const liveApi = {
    async getLivePlayers(): Promise<LivePlayer[]> {
        return await fetchApi<LivePlayer[]>('/live/players');
    },

    async getPlayer(id: string): Promise<LivePlayer | null> {
        try {
            return await fetchApi<LivePlayer>(`/live/players/${id}`);
        } catch (error) {
            return null;
        }
    },
};
