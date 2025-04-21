// src/pages/restaurant/RestaurantDashboardPage.tsx (Uses Profile from Context)
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const RestaurantDashboardPage: React.FC = () => {
  // Get user, profile, and logout directly from context
  // No need for local state or useEffect for profile fetching here
  const { user, profile, logout } = useAuth();

  // We shouldn't reach this page unless profile is loaded and role is correct,
  // due to ProtectedRoute, but we can add checks for robustness.
  if (!profile) {
      // This might happen briefly or if something went wrong fetching profile in context
      return <div>Loading dashboard or profile error...</div>;
  }

  // Profile exists and role was validated by ProtectedRoute
  return (
    <div>
      <h1>Restaurant Dashboard</h1>
      <p>Welcome, {profile.full_name || user?.email} (Restaurant)!</p>
      <p>Your Role: {profile.role}</p>
      <button onClick={logout}>Logout</button>

      <hr style={{ margin: '20px 0' }}/>

      {/* TODO: Add Restaurant Menu Management component/link here */}
      {/* TODO: Add Restaurant Order Management component/link here */}
      <p>(Menu/Order sections go here)</p>

    </div>
  );
};

export default RestaurantDashboardPage;