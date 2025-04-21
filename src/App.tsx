// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Assuming this is still correct
import { useLanguage } from './context/language-provider';
import './App.css';

// Admin Components
import AdminLoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/DashboardPage';
import AdminProtectedRoute from './components/ProtectedRoute';

// Restaurant Components (Placeholders needed)
import RestaurantLoginPage from './pages/restaurant/RestaurantLoginPage';
import RestaurantDashboardPage from './pages/restaurant/RestaurantDashboardPage';
import RestaurantProtectedRoute from './components/restaurant/RestaurantProtectedRoute';
import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage'; // Add pages as needed

function App() {
  const { loading } = useAuth(); // Assumes AuthContext is still wrapped in main.tsx
  const { language, setLanguage } = useLanguage();

  if (loading) {
    return <div>Loading application...</div>;
  }

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang); // Use setLanguage from the hook
  };

  return (
    <Router>
      {/* Temporary Language Switcher Button */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <button onClick={toggleLanguage}>
          Switch to {language === 'en' ? 'العربية' : 'English'}
        </button>
        <span style={{ marginLeft: '5px' }}>({language})</span>
      </div>
      {/* End Temp Button */}

      <Routes>
        {/* ----- Admin Routes ----- */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/" element={ <AdminProtectedRoute> <AdminDashboardPage /> </AdminProtectedRoute> } />

        {/* ----- Restaurant Routes ----- */}
        <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
        <Route path="/restaurant/dashboard" element={ <RestaurantProtectedRoute> <RestaurantDashboardPage /> </RestaurantProtectedRoute> } />
        {/* <Route path="/restaurant/menu" element={ <RestaurantProtectedRoute> <RestaurantMenuPage /> </RestaurantProtectedRoute> } /> */}

      </Routes>
    </Router>
  );
}
export default App;