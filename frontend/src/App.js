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

// Educational Pages
import WhatIsIPV from './pages/WhatIsIPV';
import TypesOfAbuse from './pages/TypesOfAbuse';
import CycleOfViolence from './pages/CycleOfViolence';
import RecognizeVictim from './pages/RecognizeVictim';
import RecognizeWitness from './pages/RecognizeWitness';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Educational Routes */}
        <Route path="/understand-abuse/what-is-ipv" element={<WhatIsIPV />} />
        <Route path="/understand-abuse/types" element={<TypesOfAbuse />} />
        <Route path="/understand-abuse/cycle" element={<CycleOfViolence />} />
        <Route path="/recognize-signs/victims" element={<RecognizeVictim />} />
        <Route path="/recognize-signs/witnesses" element={<RecognizeWitness />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/victim-dashboard" element={<VictimDashboard />} />
          <Route path="/self-screen" element={<SelfScreening />} />
          <Route path="/journal" element={<Journal />} />
        </Route>

        {/* Public Role Dashboards */}
        <Route path="/witness" element={<WitnessDashboard />} />
        <Route path="/healthcare" element={<HealthcareDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Public Resources */}
        <Route path="/resources/legal" element={<LegalResources />} />
        <Route path="/resources/shelters" element={<Shelters />} />
        <Route path="/helplines" element={<Helplines />} />

        {/* Feature Routes */}
        <Route path="/report-incident" element={<WitnessReport />} />
        <Route path="/forms-of-abuse" element={<FormsOfAbuse />} />

        {/* Placeholders for now */}
        <Route path="/self-assessment" element={<div className="container" style={{ padding: '100px' }}><h1>Self Assessment Tool</h1><p>Coming soon...</p></div>} />
        <Route path="/helping-others" element={<div className="container" style={{ padding: '100px' }}><h1>How to Help Others</h1><p>Coming soon...</p></div>} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;