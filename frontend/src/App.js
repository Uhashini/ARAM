import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import existing pages
import Home from './pages/Home';
import FormsOfAbuse from './pages/forms-of-abuse';
import WitnessReport from './pages/WitnessReport';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import new layout components (to be created)
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Import new pages (placeholders for now)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WitnessDashboard from './pages/WitnessDashboard';
import VictimDashboard from './pages/VictimDashboard';
import HealthcareDashboard from './pages/HealthcareDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/forms-of-abuse" element={<FormsOfAbuse />} />
            <Route path="/witness-report" element={<WitnessReport />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            
            <Route path="/witness-dashboard" element={
              <DashboardLayout>
                <WitnessDashboard />
              </DashboardLayout>
            } />
            
            <Route path="/victim-dashboard" element={
              <DashboardLayout>
                <VictimDashboard />
              </DashboardLayout>
            } />
            
            <Route path="/healthcare-dashboard" element={
              <DashboardLayout>
                <HealthcareDashboard />
              </DashboardLayout>
            } />
            
            <Route path="/admin-dashboard" element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
