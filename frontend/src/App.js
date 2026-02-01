import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './App.css';
import aramLogo from './assets/aram-hero-logo.png';

// Import existing pages
import FormsOfAbuse from './pages/forms-of-abuse';
import WitnessReport from './pages/WitnessReport';

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
              { to: "/victim-dashboard", text: "Seek Support" },
              { to: "/healthcare-dashboard", text: "Provide Support" },
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

      {/* User Cards Section with stagger animation */}
      <AnimatedSection className="user-cards-section">
        <motion.div 
          className="cards-container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            {
              icon: "🛡️",
              title: "Seek Support",
              desc: "Access confidential resources, safety planning, and support tools",
              path: "/victim-dashboard",
              iconClass: "survivor-icon"
            },
            {
              icon: "🤝",
              title: "Provide Support", 
              desc: "Tools and resources for friends, family, and supporters",
              path: "/healthcare-dashboard",
              iconClass: "supporter-icon"
            },
            {
              icon: "📚",
              title: "Understand Abuse",
              desc: "Educational resources about intimate partner violence", 
              path: "/forms-of-abuse",
              iconClass: "professional-icon"
            },
            {
              icon: "💬",
              title: "Stories",
              desc: "Read survivor stories and share your own journey",
              path: "/stories", 
              iconClass: "stories-icon"
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="user-card"
              variants={fadeInUp}
              onClick={() => handleCardClick(card.path)}
              whileHover={cardHover}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className={`card-icon ${card.iconClass}`}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                {card.icon}
              </motion.div>
              
              <motion.h3 
                className="card-title"
                whileHover={{ color: "#DE638A" }}
                transition={{ duration: 0.2 }}
              >
                {card.title}
              </motion.h3>
              
              <p className="card-desc">{card.desc}</p>
              
              <motion.div 
                className="card-arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Safety Notice Section with attention-grabbing animations */}
      <AnimatedSection className="safety-notice-section" delay={0.2}>
        <motion.div 
          className="safety-container"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="safety-title"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(74, 50, 103, 0.5)",
                "0 0 10px rgba(74, 50, 103, 0.8)", 
                "0 0 0px rgba(74, 50, 103, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Browsing this site safely
          </motion.h2>
          
          <motion.p 
            className="safety-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Remember: this website will appear on your search history. If you don't want this website 
            to appear in your browsing history, you can open a new window in "Private" or "Incognito" mode. 
            Make sure you also delete your browser history.
          </motion.p>
          
          <motion.button 
            onClick={() => navigate('/safety-guide')} 
            className="safety-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(222, 99, 138, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
          >
            Learn More Safety Actions
          </motion.button>
        </motion.div>
      </AnimatedSection>

      {/* Quick Links Cards Section with wave animation */}
      <AnimatedSection className="quick-links-section" delay={0.3}>
        <motion.div 
          className="quick-links-container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            {
              icon: "📋",
              title: "Forms of Abuse",
              text: "Learn about different types of intimate partner violence",
              path: "/forms-of-abuse",
              iconClass: "forms-icon"
            },
            {
              icon: "⚖️", 
              title: "Laws & Rights",
              text: "Understand your legal rights and available protections",
              path: "/laws",
              iconClass: "laws-icon"
            },
            {
              icon: "💡",
              title: "Spotting & Tips", 
              text: "Recognize warning signs and get practical safety tips",
              path: "/tips",
              iconClass: "tips-icon"
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="quick-link-card"
              variants={fadeInUp}
              onClick={() => handleCardClick(card.path)}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className={`quick-icon ${card.iconClass}`}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {card.icon}
              </motion.div>
              
              <motion.h3 
                className="quick-title"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {card.title}
              </motion.h3>
              
              <p className="quick-text">{card.text}</p>
              
              <motion.span 
                className="quick-link"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Learn More →
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
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
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;