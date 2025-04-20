import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage'; // We'll create this
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // We'll create this
import './App.css'; // Optional default styles

function App() {
  const { loading } = useAuth(); // Get loading state from our simple context

  // Show loading message while initial session check runs
  if (loading) {
    return <div>Loading application...</div>;
  }

  // Once loading is false, render routes
  return (
    <Router>
      <Routes>
        {/* Login page is public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard is protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
         {/* Add other routes here later */}
      </Routes>
    </Router>
  );
}

export default App;