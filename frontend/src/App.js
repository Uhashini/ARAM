import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './App.css';
import aramLogo from './assets/aram-hero-logo.png';

// Import existing pages
import FormsOfAbuse from './pages/forms-of-abuse';
import WitnessReport from './pages/WitnessReport';

// Import new content pages
import FormsOfAbuseNew from './pages/FormsOfAbuse';
import HelpingOthers from './pages/HelpingOthers';
import OnlineSafety from './pages/OnlineSafety';
import ConsentStories from './pages/ConsentStories';
import StalkingStories from './pages/StalkingStories';
import MythsQuiz from './pages/MythsQuiz';
import WarningSigns from './pages/WarningSigns';
import SelfChecks from './pages/SelfChecks';
import LeavingSafely from './pages/LeavingSafely';
import SupportTypes from './pages/SupportTypes';
import FinancialHelp from './pages/FinancialHelp';
import LocalServices from './pages/LocalServices';
import Helplines from './pages/Helplines';
import Resources from './pages/Resources';

// Import new layout components
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Import new pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WitnessDashboard from './pages/WitnessDashboard';
import VictimDashboard from './pages/VictimDashboard';
import HealthcareDashboard from './pages/HealthcareDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const cardHover = {
  scale: 1.05,
  y: -8,
  transition: { duration: 0.3, ease: "easeOut" }
};

const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "easeOut" }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Animated Components
const AnimatedSection = ({ children, className, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.8, delay, ease: "easeOut" }
        }
      }}
    >
      {children}
    </motion.section>
  );
};

// Professional IPV Prevention Homepage with Animations
const HomePage = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      {/* Fixed Top Navigation with slide down animation */}
      <motion.nav 
        className="top-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-left"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img 
              src={aramLogo} 
              alt="Aram Logo" 
              className="nav-logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <motion.span 
              className="nav-brand"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              Aram
            </motion.span>
          </motion.div>
          
          <motion.div 
            className="nav-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { to: "/forms-of-abuse", text: "Understand Abuse" },
              { to: "/victim-dashboard", text: "Recognize Abuse" },
              { to: "/healthcare-dashboard", text: "Seek Support" },
              { to: "/stories", text: "Stories" }
            ].map((link, index) => (
              <motion.div key={link.to}>
                <Link 
                  to={link.to} 
                  className="nav-link"
                >
                  <motion.span
                    whileHover={{ scale: 1.1, color: "#DE638A" }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.text}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="nav-right"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              onClick={() => navigate('/login')} 
              className="login-btn"
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section with complex animations */}
      <AnimatedSection className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-left"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            <motion.img 
              src={aramLogo} 
              alt="Empowering Support" 
              className="hero-logo"
              animate={pulseAnimation}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <motion.div 
            className="hero-right"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              You're safe here.
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Aram supports survivors of intimate partner violence with confidential resources, 
              education, and community.
            </motion.p>
            
            <motion.button 
              onClick={() => navigate('/victim-dashboard')} 
              className="hero-cta"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 30px rgba(222, 99, 138, 0.4)",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Start Your Journey →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* User Role Cards Section */}
      <AnimatedSection className="user-roles-section">
        <div className="user-roles-container">
          <motion.h2 
            className="user-roles-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Choose how you want to use Aram
          </motion.h2>
          
          <motion.p 
            className="user-roles-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Select your role to get a tailored experience and the right tools for you.
          </motion.p>
          
          <motion.div 
            className="user-roles-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "Witness",
                desc: "Report concerns safely if you've seen or suspect abuse.",
                path: "/witness-dashboard",
                btnText: "Go to Witness Space",
                color: "witness"
              },
              {
                title: "Victim / Survivor", 
                desc: "Access personalized support, safety planning, and resources.",
                path: "/victim-dashboard",
                btnText: "Go to Survivor Space",
                color: "survivor"
              },
              {
                title: "Healthcare Worker",
                desc: "Use clinical tools and guidance to support patients facing IPV.",
                path: "/healthcare-dashboard", 
                btnText: "Go to Healthcare Space",
                color: "healthcare"
              },
              {
                title: "Admin",
                desc: "Manage reports, system settings, and overall platform integrity.",
                path: "/admin-dashboard",
                btnText: "Go to Admin Space", 
                color: "admin"
              }
            ].map((role, index) => (
              <motion.div
                key={role.title}
                className={`user-role-card user-role-card--${role.color}`}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 15px 35px rgba(74, 50, 103, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="user-role-title"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {role.title}
                </motion.h3>
                
                <motion.p 
                  className="user-role-desc"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {role.desc}
                </motion.p>
                
                <motion.button
                  className="user-role-btn"
                  onClick={() => navigate(role.path)}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(222, 99, 138, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.span
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {role.btnText} →
                  </motion.span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      

      {/* Understand Abuse Section */}
      <AnimatedSection className="understand-abuse-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Understand abuse</h2>
            <p className="section-subtitle">
              Short explanations and real stories to help you recognize different forms of abuse.
            </p>
          </motion.div>

          <motion.div 
            className="content-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "Forms of abuse",
                desc: "Brief definitions of physical, emotional, sexual, financial and digital abuse.",
                action: "Learn about abuse types",
                path: "/forms-of-abuse"
              },
              {
                title: "Helping a family or friend",
                desc: "Simple, safe ways to support someone you think might be experiencing abuse.",
                action: "See ways to help",
                path: "/helping-others"
              },
              {
                title: "Online safety",
                desc: "Tips to protect your devices, accounts and online activity.",
                action: "View safety tips",
                path: "/online-safety"
              },
              {
                title: "Stories of sexual consent",
                desc: "Understand consent and your rights through survivor stories.",
                action: "Read consent stories",
                path: "/consent-stories"
              },
              {
                title: "Stories of stalking and harassment",
                desc: "Learn about stalking, harassment and your legal options.",
                action: "Read survivor stories",
                path: "/stalking-stories"
              },
              {
                title: "Dispelling myths",
                desc: "A short quiz to challenge common myths about domestic abuse.",
                action: "Take the myths quiz",
                path: "/myths-quiz"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="content-card"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(item.path)}
              >
                <h3 className="content-card-title">{item.title}</h3>
                <p className="content-card-desc">{item.desc}</p>
                <motion.span 
                  className="content-card-action"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.action} →
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Recognize Abuse Section */}
      <AnimatedSection className="recognize-abuse-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Recognize abuse</h2>
            <p className="section-subtitle">
              Guidance and tools to help you notice warning signs early.
            </p>
          </motion.div>

          <motion.div 
            className="content-grid content-grid--two-col"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "Warning signs",
                desc: "Learn about behaviour patterns, injuries and controlling actions that may signal abuse.",
                action: "View warning signs",
                path: "/warning-signs"
              },
              {
                title: "Self checks",
                desc: "Use short checklists and screenings to reflect on your situation or someone else's.",
                action: "Take self assessment",
                path: "/self-checks"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="content-card content-card--large"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(item.path)}
              >
                <h3 className="content-card-title">{item.title}</h3>
                <p className="content-card-desc">{item.desc}</p>
                <motion.span 
                  className="content-card-action"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.action} →
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Seeking Support Section */}
      <AnimatedSection className="seeking-support-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Seeking support</h2>
            <p className="section-subtitle">
              Practical information and services to help you plan next steps safely.
            </p>
          </motion.div>

          <motion.div 
            className="content-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "Leaving an abusive relationship",
                desc: "Step-by-step planning and safety tips if you are thinking about leaving.",
                action: "Plan to leave safely",
                path: "/leaving-safely"
              },
              {
                title: "Types of support",
                desc: "Learn about shelters, counselling, legal support and other services.",
                action: "Explore support options",
                path: "/support-types"
              },
              {
                title: "Financial independence",
                desc: "Information about financial abuse and building financial stability.",
                action: "Learn about finances",
                path: "/financial-help"
              },
              {
                title: "Locate support",
                desc: "Find local services, hospitals and community organisations near you.",
                action: "Find local services",
                path: "/local-services"
              },
              {
                title: "National helplines",
                desc: "24/7 helplines that can support you wherever you live.",
                action: "View helplines",
                path: "/helplines"
              },
              {
                title: "Resources",
                desc: "Extra reading, legal information and wellbeing resources.",
                action: "Browse resources",
                path: "/resources"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="content-card"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(item.path)}
              >
                <h3 className="content-card-title">{item.title}</h3>
                <p className="content-card-desc">{item.desc}</p>
                <motion.span 
                  className="content-card-action"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.action} →
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer with slide up animation */}
      <motion.footer 
        className="homepage-footer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="footer-container">
          <motion.div 
            className="footer-content"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="footer-section" variants={fadeInUp}>
              <h4>Aram</h4>
              <p>Supporting survivors with confidential resources and community</p>
            </motion.div>
            
            <motion.div className="footer-section" variants={fadeInUp}>
              <h4>Quick Links</h4>
              {[
                { to: "/forms-of-abuse", text: "Forms of Abuse" },
                { to: "/laws", text: "Laws & Rights" },
                { to: "/tips", text: "Safety Tips" },
                { to: "/stories", text: "Stories" }
              ].map((link) => (
                <motion.div key={link.to}>
                  <Link 
                    to={link.to}
                    whileHover={{ x: 5, color: "#DE638A" }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div className="footer-section" variants={fadeInUp}>
              <h4>Get Help</h4>
              <motion.p 
                className="helpline"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Crisis Helpline: <span className="helpline-number">1-800-799-7233</span>
              </motion.p>
              <p>Available 24/7 - All calls are confidential</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>&copy; {new Date().getFullYear()} Aram. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Professional Animated Homepage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Public Routes */}
            <Route path="/forms-of-abuse" element={<FormsOfAbuseNew />} />
            <Route path="/helping-others" element={<HelpingOthers />} />
            <Route path="/online-safety" element={<OnlineSafety />} />
            <Route path="/consent-stories" element={<ConsentStories />} />
            <Route path="/stalking-stories" element={<StalkingStories />} />
            <Route path="/myths-quiz" element={<MythsQuiz />} />
            <Route path="/warning-signs" element={<WarningSigns />} />
            <Route path="/self-checks" element={<SelfChecks />} />
            <Route path="/leaving-safely" element={<LeavingSafely />} />
            <Route path="/support-types" element={<SupportTypes />} />
            <Route path="/financial-help" element={<FinancialHelp />} />
            <Route path="/local-services" element={<LocalServices />} />
            <Route path="/helplines" element={<Helplines />} />
            <Route path="/resources" element={<Resources />} />
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
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;