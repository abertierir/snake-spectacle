import React, { useState } from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameMode } from '@/api/types';
import { useAuth } from '@/hooks/useAuth';
import { leaderboardApi } from '@/api/mockApi';
import { toast } from 'sonner';

export default function Index() {
  const [mode, setMode] = useState<GameMode>('pass-through');
  const game = useSnakeGame(mode);
  const { user } = useAuth();

  const handleSubmitScore = async () => {
    if (!user) {
      toast.error('Login to submit your score!');
      return;
    }
    await leaderboardApi.submitScore({ userId: user.id, score: game.score, mode });
    toast.success(`Score ${game.score} submitted!`);
  };

  return (
    <div className="container px-4 py-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl text-primary neon-text mb-2">SNAKE GAME</h1>
        <p className="text-muted-foreground text-sm font-mono">Use arrow keys or WASD to move • Space to pause</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        {(['pass-through', 'walls'] as const).map(m => (
          <button
            key={m}
            onClick={() => { if (!game.isRunning) { setMode(m); game.reset(); } }}
            className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
              mode === m
                ? 'bg-primary text-primary-foreground neon-box'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {m === 'pass-through' ? '🌀 Pass-Through' : '🧱 Walls'}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="font-mono text-lg">
        Score: <span className="text-primary neon-text">{game.score}</span>
      </div>

      {/* Game */}
      <GameCanvas
        snake={game.snake}
        food={game.food}
        gridSize={game.gridSize}
        isGameOver={game.isGameOver}
      />

      {/* Controls */}
      <div className="flex gap-3">
        {!game.isRunning && !game.isGameOver && (
          <button onClick={game.start} className="px-6 py-2 bg-primary text-primary-foreground font-mono rounded-md neon-box hover:opacity-90 transition-opacity">
            Start
          </button>
        )}
        {game.isRunning && (
          <button onClick={game.pause} className="px-6 py-2 bg-secondary text-secondary-foreground font-mono rounded-md cyan-box hover:opacity-90 transition-opacity">
            Pause
          </button>
        )}
        {game.isGameOver && (
          <>
            <button onClick={() => { game.reset(); game.start(); }} className="px-6 py-2 bg-primary text-primary-foreground font-mono rounded-md neon-box hover:opacity-90 transition-opacity">
              Play Again
            </button>
            {game.score > 0 && (
              <button onClick={handleSubmitScore} className="px-6 py-2 bg-accent text-accent-foreground font-mono rounded-md accent-glow hover:opacity-90 transition-opacity">
                Submit Score
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 sm:hidden mt-4">
        <div />
        <button onClick={() => game.changeDirection('UP')} className="bg-muted p-3 rounded-md text-foreground font-bold">↑</button>
        <div />
        <button onClick={() => game.changeDirection('LEFT')} className="bg-muted p-3 rounded-md text-foreground font-bold">←</button>
        <button onClick={() => game.changeDirection('DOWN')} className="bg-muted p-3 rounded-md text-foreground font-bold">↓</button>
        <button onClick={() => game.changeDirection('RIGHT')} className="bg-muted p-3 rounded-md text-foreground font-bold">→</button>
      </div>
    </div>
  );
}
