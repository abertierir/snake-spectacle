import React from 'react';
import { Position } from '@/api/types';

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  cellSize?: number;
  isGameOver?: boolean;
  isWatching?: boolean;
}

export function GameCanvas({ snake, food, gridSize, cellSize = 20, isGameOver = false, isWatching = false }: GameCanvasProps) {
  const size = gridSize * cellSize;

  return (
    <div
      className={`relative border-2 ${isGameOver ? 'border-destructive' : 'border-primary/40'} rounded-sm game-grid transition-colors`}
      style={{ width: size, height: size }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: gridSize }).map((_, y) =>
          Array.from({ length: gridSize }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute border border-primary/5"
              style={{ left: x * cellSize, top: y * cellSize, width: cellSize, height: cellSize }}
            />
          ))
        )}
      </div>

      {/* Food */}
      <div
        className="absolute rounded-full bg-accent animate-pulse-neon"
        style={{
          left: food.x * cellSize + 2,
          top: food.y * cellSize + 2,
          width: cellSize - 4,
          height: cellSize - 4,
          boxShadow: '0 0 8px hsl(330 100% 60% / 0.8)',
        }}
      />

      {/* Snake */}
      {snake.map((seg, i) => (
        <div
          key={i}
          className={`absolute rounded-sm ${i === 0 ? 'bg-primary' : 'bg-primary/70'}`}
          style={{
            left: seg.x * cellSize + 1,
            top: seg.y * cellSize + 1,
            width: cellSize - 2,
            height: cellSize - 2,
            boxShadow: i === 0 ? '0 0 6px hsl(120 100% 62% / 0.6)' : 'none',
            transition: isWatching ? 'left 0.15s linear, top 0.15s linear' : undefined,
          }}
        />
      ))}

      {/* Game over overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <span className="font-pixel text-destructive text-sm neon-text">GAME OVER</span>
        </div>
      )}
    </div>
  );
}
