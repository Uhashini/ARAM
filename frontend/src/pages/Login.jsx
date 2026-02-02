import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const API_URL = 'http://127.0.0.1:5001'; // Change to your deployed URL when ready
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'victim',
    organization: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on edit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    // Prepare payload
    let payload;
    if (isLogin) {
      payload = { email: formData.email, password: formData.password };
    } else {
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organization: formData.role === 'healthcare' ? formData.organization : undefined
      };
    }

    try {
      // Using 127.0.0.1 instead of localhost for reliability
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Success!
        localStorage.setItem('userInfo', JSON.stringify(data));
        // Redirect based on role
        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'healthcare') navigate('/healthcare');
        else if (data.role === 'witness') navigate('/witness');
        else navigate('/victim-dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Please ensure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navigation />

      <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--white)',
            padding: '3rem',
            borderRadius: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Securely access your dashboard' : 'Join ARAM for support and safety'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <User size={20} color="#9ca3af" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select Your Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      <option value="victim">Victim / Survivor</option>
                      <option value="witness">Witness / Community Member</option>
                      <option value="healthcare">Healthcare Professional</option>
                    </select>
                  </div>

                  {formData.role === 'healthcare' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginBottom: '1rem' }}
                    >
                      <input
                        type="text"
                        name="organization"
                        placeholder="Hospital / Clinic Name"
                        value={formData.organization}
                        onChange={handleChange}
                        required={formData.role === 'healthcare'}
                        style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <Mail size={20} color="#9ca3af" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: isLogin ? '1.5rem' : '1rem', position: 'relative' }}>
              <Lock size={20} color="#9ca3af" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.9rem 3rem 0.9rem 3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ marginBottom: '1.5rem', position: 'relative' }}
              >
                <Lock size={20} color="#9ca3af" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                />
              </motion.div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;