import { describe, it, expect } from 'vitest';
import { moveSnake } from '@/hooks/useSnakeGame';
import { Position, Direction } from '@/api/types';

describe('moveSnake', () => {
  const gridSize = 20;
  const baseSnake: Position[] = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];

  it('moves snake right', () => {
    const food = { x: 0, y: 0 };
    const { newSnake, ate, dead } = moveSnake(baseSnake, 'RIGHT', food, 'walls', gridSize);
    expect(dead).toBe(false);
    expect(ate).toBe(false);
    expect(newSnake[0]).toEqual({ x: 6, y: 5 });
    expect(newSnake).toHaveLength(3);
  });

  it('moves snake up', () => {
    const food = { x: 0, y: 0 };
    const { newSnake } = moveSnake(baseSnake, 'UP', food, 'walls', gridSize);
    expect(newSnake[0]).toEqual({ x: 5, y: 4 });
  });

  it('moves snake down', () => {
    const food = { x: 0, y: 0 };
    const { newSnake } = moveSnake(baseSnake, 'DOWN', food, 'walls', gridSize);
    expect(newSnake[0]).toEqual({ x: 5, y: 6 });
  });

  it('moves snake left', () => {
    const snake: Position[] = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }];
    const food = { x: 0, y: 0 };
    const { newSnake } = moveSnake(snake, 'LEFT', food, 'walls', gridSize);
    expect(newSnake[0]).toEqual({ x: 4, y: 5 });
  });

  it('grows snake when eating food', () => {
    const food = { x: 6, y: 5 };
    const { newSnake, ate } = moveSnake(baseSnake, 'RIGHT', food, 'walls', gridSize);
    expect(ate).toBe(true);
    expect(newSnake).toHaveLength(4);
  });

  describe('walls mode', () => {
    it('dies when hitting right wall', () => {
      const snake: Position[] = [{ x: 19, y: 5 }, { x: 18, y: 5 }];
      const { dead } = moveSnake(snake, 'RIGHT', { x: 0, y: 0 }, 'walls', gridSize);
      expect(dead).toBe(true);
    });

    it('dies when hitting left wall', () => {
      const snake: Position[] = [{ x: 0, y: 5 }, { x: 1, y: 5 }];
      const { dead } = moveSnake(snake, 'LEFT', { x: 10, y: 10 }, 'walls', gridSize);
      expect(dead).toBe(true);
    });

    it('dies when hitting top wall', () => {
      const snake: Position[] = [{ x: 5, y: 0 }, { x: 5, y: 1 }];
      const { dead } = moveSnake(snake, 'UP', { x: 10, y: 10 }, 'walls', gridSize);
      expect(dead).toBe(true);
    });

    it('dies when hitting bottom wall', () => {
      const snake: Position[] = [{ x: 5, y: 19 }, { x: 5, y: 18 }];
      const { dead } = moveSnake(snake, 'DOWN', { x: 10, y: 10 }, 'walls', gridSize);
      expect(dead).toBe(true);
    });
  });

  describe('pass-through mode', () => {
    it('wraps right to left', () => {
      const snake: Position[] = [{ x: 19, y: 5 }, { x: 18, y: 5 }];
      const { newSnake, dead } = moveSnake(snake, 'RIGHT', { x: 10, y: 10 }, 'pass-through', gridSize);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 0, y: 5 });
    });

    it('wraps left to right', () => {
      const snake: Position[] = [{ x: 0, y: 5 }, { x: 1, y: 5 }];
      const { newSnake, dead } = moveSnake(snake, 'LEFT', { x: 10, y: 10 }, 'pass-through', gridSize);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 19, y: 5 });
    });

    it('wraps top to bottom', () => {
      const snake: Position[] = [{ x: 5, y: 0 }, { x: 5, y: 1 }];
      const { newSnake, dead } = moveSnake(snake, 'UP', { x: 10, y: 10 }, 'pass-through', gridSize);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 5, y: 19 });
    });

    it('wraps bottom to top', () => {
      const snake: Position[] = [{ x: 5, y: 19 }, { x: 5, y: 18 }];
      const { newSnake, dead } = moveSnake(snake, 'DOWN', { x: 10, y: 10 }, 'pass-through', gridSize);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 5, y: 0 });
    });
  });

  it('dies on self collision', () => {
    // Snake curled into itself
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 4, y: 5 },
    ];
    // Moving LEFT from (5,5) → (4,5) which is occupied
    const { dead } = moveSnake(snake, 'LEFT', { x: 10, y: 10 }, 'walls', gridSize);
    expect(dead).toBe(true);
  });
});
