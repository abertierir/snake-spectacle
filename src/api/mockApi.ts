import { AuthResponse, GameMode, LeaderboardEntry, LivePlayer, Position, Direction, SubmitScorePayload, User } from './types';

// --- In-memory state ---
let currentUser: User | null = null;
const users: Map<string, User & { password: string }> = new Map();

const leaderboardData: LeaderboardEntry[] = [
  { id: '1', userId: 'bot1', username: 'PixelViper', score: 2450, mode: 'walls', date: '2026-03-02' },
  { id: '2', userId: 'bot2', username: 'NeonByte', score: 2100, mode: 'pass-through', date: '2026-03-02' },
  { id: '3', userId: 'bot3', username: 'RetroKing', score: 1890, mode: 'walls', date: '2026-03-01' },
  { id: '4', userId: 'bot4', username: 'GlitchFox', score: 1750, mode: 'pass-through', date: '2026-03-01' },
  { id: '5', userId: 'bot5', username: 'ArcadeWolf', score: 1600, mode: 'walls', date: '2026-02-28' },
  { id: '6', userId: 'bot6', username: 'CyberSnake', score: 1480, mode: 'pass-through', date: '2026-02-28' },
  { id: '7', userId: 'bot7', username: 'BitCrusher', score: 1320, mode: 'walls', date: '2026-02-27' },
  { id: '8', userId: 'bot8', username: 'QuantumQ', score: 1200, mode: 'pass-through', date: '2026-02-27' },
  { id: '9', userId: 'bot9', username: 'VectorV', score: 1050, mode: 'walls', date: '2026-02-26' },
  { id: '10', userId: 'bot10', username: 'ZeroCool', score: 900, mode: 'pass-through', date: '2026-02-26' },
];

const GRID_SIZE = 20;

function randomPos(): Position {
  return { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
}

function createBotSnake(): Position[] {
  const head = { x: Math.floor(Math.random() * 14) + 3, y: Math.floor(Math.random() * 14) + 3 };
  return [head, { x: head.x - 1, y: head.y }, { x: head.x - 2, y: head.y }];
}

const livePlayers: LivePlayer[] = [
  { id: 'live1', username: 'PixelViper', mode: 'walls', score: 80, snake: createBotSnake(), food: randomPos(), direction: 'RIGHT', isAlive: true },
  { id: 'live2', username: 'NeonByte', mode: 'pass-through', score: 120, snake: createBotSnake(), food: randomPos(), direction: 'DOWN', isAlive: true },
  { id: 'live3', username: 'GlitchFox', mode: 'walls', score: 45, snake: createBotSnake(), food: randomPos(), direction: 'LEFT', isAlive: true },
];

// --- Delay helper ---
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// --- Auth API ---
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(300);
    const user = Array.from(users.values()).find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safe } = user;
      currentUser = safe;
      return { user: safe, error: null };
    }
    return { user: null, error: 'Invalid email or password' };
  },

  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    await delay(300);
    if (Array.from(users.values()).some(u => u.email === email)) {
      return { user: null, error: 'Email already registered' };
    }
    if (Array.from(users.values()).some(u => u.username === username)) {
      return { user: null, error: 'Username already taken' };
    }
    const id = crypto.randomUUID();
    const user = { id, username, email, password };
    users.set(id, user);
    const { password: _, ...safe } = user;
    currentUser = safe;
    return { user: safe, error: null };
  },

  async logout(): Promise<void> {
    await delay(100);
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return currentUser;
  },
};

// --- Leaderboard API ---
export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    await delay(200);
    const filtered = mode ? leaderboardData.filter(e => e.mode === mode) : leaderboardData;
    return [...filtered].sort((a, b) => b.score - a.score);
  },

  async submitScore(payload: SubmitScorePayload): Promise<LeaderboardEntry> {
    await delay(200);
    const entry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      userId: payload.userId,
      username: currentUser?.username || 'Anonymous',
      score: payload.score,
      mode: payload.mode,
      date: new Date().toISOString().split('T')[0],
    };
    leaderboardData.push(entry);
    return entry;
  },
};

// --- Live Players API ---
function moveBot(player: LivePlayer): void {
  if (!player.isAlive) return;

  const head = player.snake[0];
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

  // Simple AI: move toward food with some randomness
  if (Math.random() < 0.7) {
    const dx = player.food.x - head.x;
    const dy = player.food.y - head.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      player.direction = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
      player.direction = dy > 0 ? 'DOWN' : 'UP';
    }
  } else {
    const valid = dirs.filter(d => d !== opposites[player.direction]);
    player.direction = valid[Math.floor(Math.random() * valid.length)];
  }

  const newHead = { ...head };
  switch (player.direction) {
    case 'UP': newHead.y--; break;
    case 'DOWN': newHead.y++; break;
    case 'LEFT': newHead.x--; break;
    case 'RIGHT': newHead.x++; break;
  }

  // Wrap around for bots
  if (player.mode === 'pass-through') {
    newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
    newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
  } else {
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      player.isAlive = false;
      // Respawn after a bit
      setTimeout(() => {
        player.snake = createBotSnake();
        player.score = 0;
        player.isAlive = true;
        player.food = randomPos();
      }, 3000);
      return;
    }
  }

  // Self collision check
  if (player.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
    player.isAlive = false;
    setTimeout(() => {
      player.snake = createBotSnake();
      player.score = 0;
      player.isAlive = true;
      player.food = randomPos();
    }, 3000);
    return;
  }

  player.snake.unshift(newHead);

  if (newHead.x === player.food.x && newHead.y === player.food.y) {
    player.score += 10;
    player.food = randomPos();
  } else {
    player.snake.pop();
  }
}

// Run bot simulation
setInterval(() => {
  livePlayers.forEach(moveBot);
}, 200);

export const liveApi = {
  async getLivePlayers(): Promise<LivePlayer[]> {
    await delay(100);
    return livePlayers.map(p => ({ ...p, snake: [...p.snake] }));
  },

  async getPlayer(id: string): Promise<LivePlayer | null> {
    await delay(50);
    const p = livePlayers.find(lp => lp.id === id);
    return p ? { ...p, snake: [...p.snake] } : null;
  },
};
