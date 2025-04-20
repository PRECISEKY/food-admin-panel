import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

// --- Interfaces ---
interface Profile {
  id: string;
  role: string;
  full_name?: string;
  email?: string | null;
}

interface SubscriptionStub {
    id: string;
}

interface Restaurant {
  id: string;
  name: { en?: string; ar?: string };
  phone_number: string | null;
  status: string;
  created_at: string;
  profile_id: string;
  profile: Profile | null;
  subscriptions?: SubscriptionStub[] | null;
}

interface ActivatableRestaurant extends Omit<Restaurant, 'subscriptions'> {}

// --- Component ---
const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth(); // Removed adminProfile as it's fetched locally now

  // Local Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Pending Restaurants state
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [errorPending, setErrorPending] = useState<string | null>(null);

  // Activatable Restaurants state
  const [activatableRestaurants, setActivatableRestaurants] = useState<ActivatableRestaurant[]>([]);
  const [loadingActivatable, setLoadingActivatable] = useState(false);
  const [errorActivatable, setErrorActivatable] = useState<string | null>(null);


  // --- Data Fetching Functions ---
  const fetchAdminProfile = useCallback(async (userId: string) => {
    // ... function code same as before ...
    console.log('[DashboardPage] Fetching admin profile...');
    setProfileLoading(true);
    setProfileError(null);
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('id, role, full_name, email')
        .eq('id', userId)
        .maybeSingle();
      console.log('[DashboardPage] Profile fetch result:', { userProfile, error });
      if (error) throw error;
      setProfile(userProfile as Profile | null);
    } catch (error: any) {
      console.error('[DashboardPage] Error fetching profile:', error);
      setProfileError(`Failed to load profile: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchPendingRestaurants = useCallback(async () => {
    // ... function code same as before ...
    console.log('[DashboardPage] Fetching pending restaurants...');
    setLoadingPending(true);
    setErrorPending(null);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`id, name, phone_number, status, created_at, profile_id, profile:profiles ( email )`)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      if (error) throw error;
      const processedData = data ? data.map(item => {
        const profileData = Array.isArray(item.profile) ? item.profile[0] : item.profile;
        return { ...item, profile: (profileData || null) as Profile | null };
      }) : [];
      setPendingRestaurants(processedData as Restaurant[]);
    } catch (error: any) {
      console.error("Error fetching pending restaurants:", error);
      setErrorPending(`Failed to fetch pending restaurants: ${error.message}`);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  const fetchActivatableRestaurants = useCallback(async () => {
    // ... function code same as before ...
    console.log('[DashboardPage] Fetching activatable restaurants...');
    setLoadingActivatable(true);
    setErrorActivatable(null);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`id, name, status, profile:profiles ( email ), subscriptions!left ( id )`)
        .eq('status', 'approved')
        .is('subscriptions.id', null);
      if (error) throw error;
      const processedData = data ? data.map(item => {
        const profileData = Array.isArray(item.profile) ? item.profile[0] : item.profile;
        const { subscriptions, ...rest } = item;
         return { ...rest, profile: (profileData || null) as Profile | null };
      }) : [];
      setActivatableRestaurants(processedData as ActivatableRestaurant[]);
    } catch (error: any) {
      console.error("Error fetching activatable restaurants:", error);
      setErrorActivatable(`Failed to fetch activatable restaurants: ${error.message}`);
    } finally {
      setLoadingActivatable(false);
    }
  }, []);

  // --- useEffect to Fetch Data ---
  useEffect(() => {
    if (user) {
      fetchAdminProfile(user.id);
      fetchPendingRestaurants();
      fetchActivatableRestaurants();
    }
  }, [user, fetchAdminProfile, fetchPendingRestaurants, fetchActivatableRestaurants]);


  // --- Action Handlers ---
  const handleUpdateStatus = async (restaurantId: string, newStatus: 'approved' | 'rejected') => {
    // ... function code same as before ...
    console.log(`[DashboardPage] Updating restaurant ${restaurantId} to ${newStatus}`);
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ status: newStatus })
        .eq('id', restaurantId);
      if (error) throw error;
      fetchPendingRestaurants();
      if (newStatus === 'approved') {
          fetchActivatableRestaurants();
      }
      alert(`Restaurant ${newStatus} successfully!`);
    } catch (error: any) {
      console.error(`Error updating status to ${newStatus}:`, error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  // --- MODIFIED FUNCTION ---
  const handleActivateTrial = async (restaurantId: string) => {
     console.log(`[DashboardPage] Activating trial for restaurant ${restaurantId}`);
     try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 14); // 14-day trial

        const { error } = await supabase
            .from('subscriptions')
            .insert({
                restaurant_id: restaurantId,
                plan_type: 'trial',
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                status: 'trial'
            });

        if (error) {
            if (error.code === '23505') {
                 alert('Error: This restaurant already has a subscription record.');
                 // Refetch ONLY if we hit this error, to correct the list display
                 fetchActivatableRestaurants();
            } else {
                throw error; // Throw other errors
            }
        } else {
             alert('Trial subscription activated successfully!');
             // Update UI state immediately on success
             setActivatableRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        }
        // No unconditional refetch here anymore

     } catch (error: any) {
        console.error('Error activating trial:', error);
        alert(`Failed to activate trial: ${error.message}`);
     }
  };


  // --- Render Profile Info ---
  const renderProfileInfo = () => {
    // ... function code same as before ...
    if (profileLoading) return <p>Loading profile information...</p>;
    if (profileError) return <p style={{ color: 'red' }}>{profileError}</p>;
    if (profile) {
      return ( <> <p>Welcome, {profile.full_name || user?.email}!</p> <p>Your Role: {profile.role}</p> </> );
    }
    return <p>Welcome, {user?.email}! (Could not load profile details)</p>;
  };

  // --- Render Component ---
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {renderProfileInfo()}
      <button onClick={logout}>Logout</button>
      <hr style={{ margin: '20px 0' }}/>

      {/* Pending Approvals Section */}
      <h2>Pending Restaurant Approvals</h2>
      {loadingPending && <p>Loading pending restaurants...</p>}
      {errorPending && <p style={{ color: 'red' }}>{errorPending}</p>}
      {!loadingPending && !errorPending && (
         <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
           <thead><tr><th>Name (English)</th><th>Owner Email</th><th>Phone</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
           <tbody>
             {pendingRestaurants.length === 0 ? (
               <tr><td colSpan={6} style={{ textAlign: 'center' }}>No pending restaurants found.</td></tr>
             ) : (
               pendingRestaurants.map((restaurant) => (
                 <tr key={restaurant.id}>
                   <td>{restaurant.name?.en || JSON.stringify(restaurant.name) || 'N/A'}</td>
                   <td>{restaurant.profile?.email ?? 'N/A'}</td>
                   <td>{restaurant.phone_number || 'N/A'}</td>
                   <td>{new Date(restaurant.created_at).toLocaleDateString()}</td>
                   <td>{restaurant.status}</td>
                   <td>
                     <button onClick={() => handleUpdateStatus(restaurant.id, 'approved')} style={{ marginRight: '5px', cursor: 'pointer' }}>Approve</button>
                     <button onClick={() => handleUpdateStatus(restaurant.id, 'rejected')} style={{ cursor: 'pointer' }}>Reject</button>
                   </td>
                 </tr>
               ))
             )}
           </tbody>
         </table>
      )}

      <hr style={{ margin: '20px 0' }}/>

      {/* Activate Subscriptions Section */}
      <h2>Activate Trial Subscription</h2>
       {loadingActivatable && <p>Loading activatable restaurants...</p>}
       {errorActivatable && <p style={{ color: 'red' }}>{errorActivatable}</p>}
       {!loadingActivatable && !errorActivatable && (
           <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead><tr><th>Name (English)</th><th>Owner Email</th><th>Status</th><th>Actions</th></tr></thead>
             <tbody>
              {activatableRestaurants.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No approved restaurants awaiting trial activation.</td></tr>
              ) : (
                activatableRestaurants.map((restaurant) => (
                   <tr key={restaurant.id}>
                     <td>{restaurant.name?.en || JSON.stringify(restaurant.name) || 'N/A'}</td>
                     <td>{restaurant.profile?.email ?? 'N/A'}</td>
                     <td>{restaurant.status}</td>
                     <td>
                       <button onClick={() => handleActivateTrial(restaurant.id)} style={{ cursor: 'pointer' }}>Activate 14-Day Trial</button>
                     </td>
                   </tr>
                ))
              )}
             </tbody>
           </table>
       )}
    </div>
  );
};

export default DashboardPage;