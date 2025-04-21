// src/components/restaurant/RestaurantProtectedRoute.tsx (Checking Role Again)
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed

interface ProtectedRouteProps { children: ReactNode; }

const RestaurantProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get session, profile, and loading state from the working AuthContext
  const { session, profile, loading } = useAuth();

  if (loading) {
    // Wait for AuthContext to finish loading session and profile
    return <div>Checking authentication...</div>;
  }

  // Check for session AND 'restaurant' role on the profile
  if (!session || profile?.role !== 'restaurant') {
    // User not logged in or not a restaurant user, redirect to restaurant login
    console.log('[RestaurantProtectedRoute] Access Denied/Redirecting. Session:', !!session, 'Profile Role:', profile?.role);
    return <Navigate to="/restaurant/login" replace />;
  }

  // User is authenticated as restaurant, render the child component
  console.log('[RestaurantProtectedRoute] Access Granted. Rendering children.');
  return <>{children}</>;
};

export default RestaurantProtectedRoute;