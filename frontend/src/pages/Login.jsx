import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'victim'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication will be implemented in task 2.1
    console.log('Login attempt:', formData);
    alert('Authentication will be implemented in task 2.1');
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__form">
        <h2>Sign In</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="victim">Victim/Survivor</option>
            <option value="witness">Witness</option>
            <option value="healthcare_worker">Healthcare Worker</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button type="submit" className="login__button">
          Sign In
        </button>

        <div className="login__links">
          <a href="/forgot-password">Forgot Password?</a>
          <a href="/register">Create Account</a>
        </div>
      </form>
    </div>
  );
};

export default Login;