import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AboutUs from './components/AboutUs';
import Dashboard from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import MobileBlocker from './components/MobileBlocker';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <MobileBlocker>
      <Router>
        <Routes>
          <Route path="/" element={<Landing user={user} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MobileBlocker>
  );
}

export default App;