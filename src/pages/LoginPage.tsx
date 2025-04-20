import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const LoginPage: React.FC = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { session } = useAuth(); // Get session from context to redirect if already logged in

  // Redirect to dashboard if a session already exists
  // This prevents showing the login page if the user is already authenticated
  useEffect(() => {
    if (session) {
      console.log('[LoginPage] Session found, redirecting to /');
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  // Handle form submission
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default browser form submission
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // Attempt to sign in with Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError; // Throw error to be caught by catch block
      }

      // Login was successful!
      // IMPORTANT: We don't navigate here directly.
      // The `onAuthStateChange` listener in `AuthContext` will detect the new session,
      // update the context state, and then `ProtectedRoute` in `App.tsx`
      // will automatically handle redirecting to the dashboard ('/').
      console.log('[LoginPage] Supabase sign-in successful.');

    } catch (error: any) {
      console.error('[LoginPage] Login failed:', error);
      // Set error message to display to the user
      setError(error.message || 'An unknown error occurred during login.');
    } finally {
      // Ensure loading is set to false whether login succeeded or failed
      setLoading(false);
    }
  };

  // Render the login form
  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;