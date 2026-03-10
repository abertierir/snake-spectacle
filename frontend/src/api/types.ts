export type GameMode = 'pass-through' | 'walls';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface LivePlayer {
  id: string;
  username: string;
  mode: GameMode;
  score: number;
  snake: Position[];
  food: Position;
  direction: Direction;
  isAlive: boolean;
}

export interface SubmitScorePayload {
  userId: string;
  score: number;
  mode: GameMode;
}
