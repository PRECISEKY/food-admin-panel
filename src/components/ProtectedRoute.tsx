import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Only get session and loading state now
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // Check only for session existence
  if (!session) {
    console.log('[ProtectedRoute - Simple] No session, redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  // Session exists, allow access (no role check here)
  console.log('[ProtectedRoute - Simple] Session found, rendering children.');
  return <>{children}</>;
};

export default ProtectedRoute;