import { useState, useCallback, useEffect, useRef } from 'react';
import { Direction, GameMode, Position } from '@/api/types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

function randomFood(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initialSnake(): Position[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

const OPPOSITES: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

export interface SnakeGameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isRunning: boolean;
  isGameOver: boolean;
  gridSize: number;
  mode: GameMode;
}

export function moveSnake(
  snake: Position[],
  direction: Direction,
  food: Position,
  mode: GameMode,
  gridSize: number = GRID_SIZE
): { newSnake: Position[]; ate: boolean; dead: boolean } {
  const head = { ...snake[0] };

  switch (direction) {
    case 'UP': head.y--; break;
    case 'DOWN': head.y++; break;
    case 'LEFT': head.x--; break;
    case 'RIGHT': head.x++; break;
  }

  if (mode === 'pass-through') {
    head.x = (head.x + gridSize) % gridSize;
    head.y = (head.y + gridSize) % gridSize;
  } else {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return { newSnake: snake, ate: false, dead: true };
    }
  }

  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return { newSnake: snake, ate: false, dead: true };
  }

  const newSnake = [head, ...snake];
  const ate = head.x === food.x && head.y === food.y;
  if (!ate) newSnake.pop();

  return { newSnake, ate, dead: false };
}

export function useSnakeGame(mode: GameMode) {
  const [snake, setSnake] = useState<Position[]>(initialSnake);
  const [food, setFood] = useState<Position>(() => randomFood(initialSnake()));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const dirRef = useRef<Direction>('RIGHT');
  const speedRef = useRef(INITIAL_SPEED);

  const reset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setFood(randomFood(s));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false);
    speedRef.current = INITIAL_SPEED;
  }, []);

  const start = useCallback(() => {
    if (isGameOver) reset();
    setIsRunning(true);
  }, [isGameOver, reset]);

  const pause = useCallback(() => setIsRunning(false), []);

  const changeDirection = useCallback((newDir: Direction) => {
    if (OPPOSITES[newDir] !== dirRef.current) {
      dirRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const tick = () => {
      setSnake(prev => {
        const { newSnake, ate, dead } = moveSnake(prev, dirRef.current, foodRef.current, mode);
        if (dead) {
          setIsGameOver(true);
          setIsRunning(false);
          return prev;
        }
        if (ate) {
          setScore(s => s + 10);
          const nf = randomFood(newSnake);
          setFood(nf);
          foodRef.current = nf;
          speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
        }
        return newSnake;
      });
    };

    const id = setInterval(tick, speedRef.current);
    return () => clearInterval(id);
  }, [isRunning, isGameOver, mode]);

  const foodRef = useRef(food);
  foodRef.current = food;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      };
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        changeDirection(dir);
        if (!isRunning && !isGameOver) start();
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (isGameOver) { reset(); start(); }
        else if (isRunning) pause();
        else start();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [changeDirection, isRunning, isGameOver, start, pause, reset]);

  return {
    snake, food, direction, score, isRunning, isGameOver,
    gridSize: GRID_SIZE, mode,
    start, pause, reset, changeDirection,
  };
}
