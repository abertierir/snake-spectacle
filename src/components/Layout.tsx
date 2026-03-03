import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Gamepad2, Trophy, Eye, LogIn, LogOut, User } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Play', icon: Gamepad2 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/watch', label: 'Watch', icon: Eye },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="font-pixel text-primary text-xs neon-text tracking-wider">
            SNAKE<span className="text-accent">.io</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                  location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm font-mono text-secondary flex items-center gap-1">
                  <User size={14} />
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-mono bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
