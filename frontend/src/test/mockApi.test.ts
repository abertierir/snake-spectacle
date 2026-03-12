import { describe, it, expect, beforeEach } from 'vitest';
import { authApi, leaderboardApi, liveApi } from '@/api/client';

describe('authApi', () => {
  // Note: authApi uses module-level state, so order matters
  const testEmail = `test-${Date.now()}@example.com`;
  const testUser = `testuser-${Date.now()}`;

  it('signup creates a new user', async () => {
    const res = await authApi.signup(testUser, testEmail, 'password123');
    expect(res.error).toBeNull();
    expect(res.user).toBeTruthy();
    expect(res.user!.username).toBe(testUser);
    expect(res.user!.email).toBe(testEmail);
  });

  it('signup rejects duplicate email', async () => {
    const res = await authApi.signup('other', testEmail, 'password123');
    expect(res.error).toBe('Email already registered');
    expect(res.user).toBeNull();
  });

  it('signup rejects duplicate username', async () => {
    const res = await authApi.signup(testUser, 'other@test.com', 'password123');
    expect(res.error).toBe('Username already taken');
  });

  it('login works with correct credentials', async () => {
    await authApi.logout();
    const res = await authApi.login(testEmail, 'password123');
    expect(res.error).toBeNull();
    expect(res.user!.email).toBe(testEmail);
  });

  it('login fails with wrong password', async () => {
    await authApi.logout();
    const res = await authApi.login(testEmail, 'wrong');
    expect(res.error).toBe('Invalid email or password');
  });

  it('getCurrentUser returns user when logged in', async () => {
    await authApi.login(testEmail, 'password123');
    const user = await authApi.getCurrentUser();
    expect(user).toBeTruthy();
    expect(user!.email).toBe(testEmail);
  });

  it('logout clears current user', async () => {
    await authApi.logout();
    const user = await authApi.getCurrentUser();
    expect(user).toBeNull();
  });
});

describe('leaderboardApi', () => {
  it('returns sorted leaderboard', async () => {
    const entries = await leaderboardApi.getLeaderboard();
    expect(entries.length).toBeGreaterThan(0);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].score).toBeGreaterThanOrEqual(entries[i].score);
    }
  });

  it('filters by mode', async () => {
    const walls = await leaderboardApi.getLeaderboard('walls');
    walls.forEach(e => expect(e.mode).toBe('walls'));

    const pt = await leaderboardApi.getLeaderboard('pass-through');
    pt.forEach(e => expect(e.mode).toBe('pass-through'));
  });

  it('submits a new score', async () => {
    const before = await leaderboardApi.getLeaderboard();
    const entry = await leaderboardApi.submitScore({ userId: 'test', score: 9999, mode: 'walls' });
    expect(entry.score).toBe(9999);
    const after = await leaderboardApi.getLeaderboard();
    expect(after.length).toBe(before.length + 1);
  });
});

describe('liveApi', () => {
  it('returns live players', async () => {
    const players = await liveApi.getLivePlayers();
    expect(players.length).toBeGreaterThan(0);
    players.forEach(p => {
      expect(p.snake.length).toBeGreaterThan(0);
      expect(p.food).toBeTruthy();
    });
  });

  it('returns a specific player', async () => {
    const players = await liveApi.getLivePlayers();
    const player = await liveApi.getPlayer(players[0].id);
    expect(player).toBeTruthy();
    expect(player!.id).toBe(players[0].id);
  });

  it('returns null for unknown player', async () => {
    const player = await liveApi.getPlayer('nonexistent');
    expect(player).toBeNull();
  });
});
