import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WitnessReport from './pages/WitnessReport';
import VictimReport from './pages/VictimReport';
import WitnessReportDetail from './pages/WitnessReportDetail';
import WitnessReportEdit from './pages/WitnessReportEdit';
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

        {/* Victim Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['victim', 'admin']} />}>
          <Route path="/victim-dashboard" element={<VictimDashboard />} />
          <Route path="/self-screen" element={<SelfScreening />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<Journal />} />
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
        <Route path="/report-victim" element={<VictimReport />} />
        <Route path="/witness/report/:id" element={<WitnessReportDetail />} />
        <Route path="/witness/report/:id/edit" element={<WitnessReportEdit />} />
        <Route path="/forms-of-abuse" element={<FormsOfAbuse />} />

        {/* Safety Planning (Placeholder or mapped to existing) */}
        <Route path="/safety-planning" element={<div className="container" style={{ padding: '100px' }}><h1>Safety Planning</h1><p>Creating a plan to stay safe. Checklist coming soon...</p></div>} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;