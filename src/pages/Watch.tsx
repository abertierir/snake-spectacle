import React, { useEffect, useState, useRef } from 'react';
import { liveApi } from '@/api/mockApi';
import { LivePlayer } from '@/api/types';
import { GameCanvas } from '@/components/game/GameCanvas';
import { Eye, ArrowLeft } from 'lucide-react';

export default function Watch() {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [watchedPlayer, setWatchedPlayer] = useState<LivePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetch = () => liveApi.getLivePlayers().then(setPlayers);
    fetch();
    const id = setInterval(fetch, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selected) {
      setWatchedPlayer(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const fetch = () => liveApi.getPlayer(selected).then(p => { if (p) setWatchedPlayer(p); });
    fetch();
    intervalRef.current = setInterval(fetch, 200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [selected]);

  return (
    <div className="container px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-xl text-primary neon-text mb-2 flex items-center justify-center gap-3">
          <Eye className="text-secondary" size={24} />
          WATCH LIVE
        </h1>
        <p className="text-muted-foreground text-sm font-mono">Watch other players in real-time</p>
      </div>

      {selected && watchedPlayer ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to players
          </button>

          <div className="text-center mb-2">
            <span className="font-mono text-secondary cyan-text text-lg">{watchedPlayer.username}</span>
            <div className="flex items-center gap-4 justify-center mt-1">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                watchedPlayer.mode === 'walls' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
              }`}>{watchedPlayer.mode}</span>
              <span className="font-mono text-sm">Score: <span className="text-primary">{watchedPlayer.score}</span></span>
              <span className={`text-xs font-mono ${watchedPlayer.isAlive ? 'text-primary' : 'text-destructive'}`}>
                {watchedPlayer.isAlive ? '● LIVE' : '● DEAD'}
              </span>
            </div>
          </div>

          <GameCanvas
            snake={watchedPlayer.snake}
            food={watchedPlayer.food}
            gridSize={20}
            isGameOver={!watchedPlayer.isAlive}
            isWatching
          />
        </div>
      ) : (
        <div className="max-w-lg mx-auto space-y-3">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${p.isAlive ? 'bg-primary animate-pulse-neon' : 'bg-destructive'}`} />
                <span className="font-mono text-foreground group-hover:text-primary transition-colors">{p.username}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                  p.mode === 'walls' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                }`}>{p.mode}</span>
                <span className="font-mono text-sm text-primary">{p.score}</span>
                <Eye size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
          {players.length === 0 && (
            <p className="text-center text-muted-foreground font-mono">No live players right now</p>
          )}
        </div>
      )}
    </div>
  );
}
