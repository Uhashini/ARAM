import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WitnessReport from './pages/WitnessReport';
import FormsOfAbuse from './pages/FormsOfAbuse';
// Import other pages as placeholders for now if they exist, or I can create simple placeholders
// Based on file list, I have these:
import VictimDashboard from './pages/VictimDashboard';
import HealthcareDashboard from './pages/HealthcareDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WitnessDashboard from './pages/WitnessDashboard';
import Login from './pages/Login';
import LegalResources from './pages/LegalResources';
import Shelters from './pages/Shelters';
import Helplines from './pages/Helplines';
import SelfScreening from './pages/SelfScreening';
import Journal from './pages/Journal';
import ProtectedRoute from './components/ProtectedRoute';
import SafetyPlanner from './pages/SafetyPlanner';
import StealthOverlay from './components/StealthOverlay';
import EvidenceLocker from './pages/EvidenceLocker';
import React, { useState, useEffect } from 'react';

// Educational Pages
import WhatIsIPV from './pages/WhatIsIPV';
import TypesOfAbuse from './pages/TypesOfAbuse';
import CycleOfViolence from './pages/CycleOfViolence';
import RecognizeVictim from './pages/RecognizeVictim';
import RecognizeWitness from './pages/RecognizeWitness';


import LogicGatesGame from './components/LogicGatesGame';
import './App.css';

function App() {
  const [stealthActive, setStealthActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle stealth mode with Escape key
      if (e.key === 'Escape') {
        setStealthActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <StealthOverlay isVisible={stealthActive} onExit={() => setStealthActive(false)} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Educational Routes */}
          <Route path="/understand-abuse/what-is-ipv" element={<WhatIsIPV />} />
          <Route path="/understand-abuse/types" element={<TypesOfAbuse />} />
          <Route path="/understand-abuse/cycle" element={<CycleOfViolence />} />
          <Route path="/recognize-signs/victims" element={<RecognizeVictim />} />
          <Route path="/recognize-signs/witnesses" element={<RecognizeWitness />} />

          {/* Victim Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['victim', 'admin']} />}>
            <Route path="/victim-dashboard" element={<VictimDashboard />} />
            <Route path="/self-screen" element={<SelfScreening />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/new" element={<Journal />} />
            <Route path="/evidence-locker" element={<EvidenceLocker />} />
          </Route>

          {/* Witness Dashboard (Public or Witness Role) */}
          <Route path="/witness" element={<WitnessDashboard />} />

          {/* Healthcare Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['healthcare', 'admin']} />}>
            <Route path="/healthcare" element={<HealthcareDashboard />} />
          </Route>

          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Public Resources (Explicitly handled to match home page buttons) */}
          <Route path="/resources/legal" element={<LegalResources />} />
          <Route path="/resources/shelters" element={<Shelters />} />
          <Route path="/legal" element={<LegalResources />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/helplines" element={<Helplines />} />

          {/* Feature Routes */}
          <Route path="/report-incident" element={<WitnessReport />} />
          <Route path="/forms-of-abuse" element={<FormsOfAbuse />} />


          {/* Logic Gates Learning Game */}
          <Route path="/learn-logic-gates" element={<LogicGatesGame />} />
          {/* Safety Planning (Placeholder or mapped to existing) */}
          <Route path="/safety-planning" element={<SafetyPlanner />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;