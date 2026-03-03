import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = isSignup
      ? await signup(username, email, password)
      : await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else navigate('/');
  };

  return (
    <div className="container px-4 py-16 flex justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-lg text-primary neon-text text-center mb-8">
          {isSignup ? 'SIGN UP' : 'LOGIN'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-muted border border-border rounded-md font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="PixelViper"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-muted border border-border rounded-md font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-primary-foreground font-mono rounded-md neon-box hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6 font-mono">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(null); }}
            className="text-secondary hover:underline"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
