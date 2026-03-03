import React, { useEffect, useState } from 'react';
import { leaderboardApi } from '@/api/mockApi';
import { GameMode, LeaderboardEntry } from '@/api/types';
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardApi.getLeaderboard(filter === 'all' ? undefined : filter).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-xl text-primary neon-text mb-2 flex items-center justify-center gap-3">
          <Trophy className="text-accent" size={24} />
          LEADERBOARD
        </h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 justify-center mb-6">
        {(['all', 'pass-through', 'walls'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground neon-box'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f === 'all' ? 'All' : f === 'pass-through' ? '🌀 Pass-Through' : '🧱 Walls'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-muted-foreground font-mono">Loading...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Player</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Mode</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-muted-foreground">Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">{entry.username}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      entry.mode === 'walls' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {entry.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-primary">{entry.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
