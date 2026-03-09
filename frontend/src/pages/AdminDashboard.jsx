import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Settings,
  Bell, Heart, BarChart3, Search, Filter,
  Plus, UserCheck, ShieldAlert, LogOut, Download,
  ChevronRight, CheckCircle, AlertTriangle, MessageSquare,
  Shield, ArrowUpRight, ArrowDownRight, Edit, Trash2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';
import aramLogo from '../assets/aram-hero-logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { '*': tabParam } = useParams();
  const activeTab = tabParam || 'dashboard';

  // Debug log for tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  const API_BASE = 'https://aram-ira2.onrender.com'; // Standardized to localhost
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [content, setContent] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    systemMode: 'Standard',
    registrationAllowed: true,
    maintenanceMode: false,
    alertThreshold: 80,
    regionRestriction: 'Delhi/NCR',
    auditRetentionDays: 90
  });
  const [riskDistribution, setRiskDistribution] = useState({});
  const [trends, setTrends] = useState([]);
  const [filters, setFilters] = useState({ state: '', district: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        navigate('/login');
        return;
      }

      try {
        const { token } = JSON.parse(userInfo);
        const headers = { 'Authorization': `Bearer ${token}` };

        // Dashboard stats
        const query = new URLSearchParams(filters).toString();
        const dashRes = await fetch(`${API_BASE}/api/admin/analytics/dashboard?${query}`, { headers });
        const dashData = await dashRes.json();
        if (dashData.stats) setStats(dashData.stats);
        if (dashData.riskDistribution) setRiskDistribution(dashData.riskDistribution);
        if (dashData.trends) setTrends(dashData.trends);

        // Users list
        const usersRes = await fetch(`${API_BASE}/api/admin/users`, { headers });
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);

        // Reports list
        const reportsRes = await fetch(`${API_BASE}/api/admin/reports`, { headers });
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);

        // Content list
        const contentRes = await fetch(`${API_BASE}/api/admin/content`, { headers });
        const contentData = await contentRes.json();
        setContent(contentData.content || []);

        // Notifications
        const notifRes = await fetch(`${API_BASE}/api/admin/notifications`, { headers });
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);

        // Settings
        const settingsRes = await fetch(`${API_BASE}/api/admin/settings`, { headers });
        const settingsData = await settingsRes.json();
        if (settingsData.settings) setSystemSettings(settingsData.settings);

        setLoading(false);

      } catch (err) {
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate, filters]);

  const handleRoleUpdate = async (userId, newRole) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        console.log(`Updated user ${userId} to role ${newRole}`);
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setContent(content.filter(item => item._id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleClearNotifications = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      // Clear locally for now if no bulk delete endpoint
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  const handleDeleteNotification = async (id) => {
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveSettings = async () => {
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(systemSettings)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateUser = async (userData) => {
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers([data.user, ...users]);
        setShowUserModal(false);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to create user');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveContent = async (contentData) => {
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${API_BASE}/api/admin/content/${editingItem._id}` : `${API_BASE}/api/admin/content`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });
      if (res.ok) {
        const data = await res.json();
        if (editingItem) {
          setContent(content.map(c => c._id === editingItem._id ? data.content : c));
        } else {
          setContent([data.content, ...content]);
        }
        setShowContentModal(false);
        setEditingItem(null);
      }
    } catch (err) { console.error(err); }
  };

  const handleGenerateReport = async (reportParams) => {
    setIsGenerating(true);
    const userInfo = localStorage.getItem('userInfo');
    const { token } = JSON.parse(userInfo);
    try {
      const res = await fetch(`${API_BASE}/api/admin/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportParams)
      });
      if (res.ok) {
        const data = await res.json();
        setReports([data.report, ...reports]);
        alert('Report generated successfully!');
      }
    } catch (err) { console.error(err); }
    finally { setIsGenerating(false); }
  };

  const handleQuickExit = () => {
    localStorage.removeItem('userInfo');
    window.location.href = 'https://weather.com';
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <LayoutDashboard size={48} className="animate-pulse" color="#1e1b4b" />
      </div>
    );
  }

  /* ─── MODAL COMPONENT ─── */
  const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="admin-modal-overlay" onClick={onClose}>
          <motion.div
            className="admin-modal"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="btn-ghost" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  /* ─── RENDER COMPONENTS ─── */

  const DashboardView = () => (
    <div className="admin-view">
      {/* Region Filter Bar */}
      <div className="system-table-card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
          <Filter size={16} /> Regional Filters:
        </div>
        <select
          className="admin-form-select"
          style={{ width: 140 }}
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        >
          <option value="">All Countries</option>
          <option value="India">India</option>
        </select>
        <select
          className="admin-form-select"
          style={{ width: 140 }}
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        >
          <option value="">All States</option>
          <option value="Delhi">Delhi</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
        </select>
        <input
          type="text"
          placeholder="District..."
          className="admin-form-input"
          style={{ width: 140 }}
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
        />
        {(filters.state || filters.district) && (
          <button
            className="btn-ghost"
            style={{ fontSize: '0.8rem' }}
            onClick={() => setFilters({ state: '', district: '' })}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="admin-stats-row">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Users size={24} /></div>
          <div className="stat-info">
            <h4>Total Users</h4>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={12} /> +12% this month
            </div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><FileText size={24} /></div>
          <div className="stat-info">
            <h4>Total Reports</h4>
            <div className="stat-value">{stats?.totalReports || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
              {reports.length} pending review
            </div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#fce7f3', color: '#be185d' }}><Heart size={24} /></div>
          <div className="stat-info">
            <h4>Referrals</h4>
            <div className="stat-value">{stats?.activeReferrals || 0}</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}><Shield size={24} /></div>
          <div className="stat-info">
            <h4>System Health</h4>
            <div className="stat-value">{stats?.systemUptime || '99.9%'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        {/* Risk Trends (Mock Visual) */}
        <div className="trend-card">
          <div className="table-header">
            <h3>Risk Level Trends</h3>
            <Filter size={16} color="#94a3b8" />
          </div>
          <div className="chart-bars">
            {trends.map((t, i) => {
              const val = t.reports || 0;
              const maxVal = Math.max(...trends.map(x => x.reports), 1);
              const barHeight = (val / maxVal) * 160;
              return (
                <div key={t.month + i} className="chart-column">
                  <div className="bar-fill" style={{ height: `${barHeight}px` }} title={`${val} reports`} />
                  <span className="bar-label">{t.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="trend-card">
          <h3>System Alerts Configuration</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 20 }}>Configure automatic triggers for high-risk detection.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <span>High Risk Report Threshold</span>
              <strong>Score &gt; 80</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <span>Region Alert (Delhi/NCR)</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <span>Notification Recipients</span>
              <strong>3 Admins</strong>
            </div>
            <button className="btn-primary" style={{ marginTop: 8 }}>Configure Alerts <Settings size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagementView = () => (
    <div className="admin-view">
      <div className="system-table-card">
        <div className="table-header">
          <h3>User & Access Control</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="search-wrapper" style={{ margin: 0 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="vault-search-input"
                style={{ padding: '8px 12px 8px 36px' }}
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => {
              setFormData({ role: 'victim' });
              setShowUserModal(true);
            }}><Plus size={16} /> Add User</button>
          </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="stat-icon" style={{ width: 32, height: 32, background: '#f1f5f9' }}><UserCheck size={16} /></div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>
                    <select
                      className="admin-form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="healthcare_worker">Healthcare</option>
                      <option value="victim">Victim</option>
                      <option value="witness">Witness</option>
                    </select>
                  </td>
                  <td>{user.email}</td>
                  <td><span style={{ color: user.role === 'admin' ? '#ef4444' : '#10b981' }}>● {user.role === 'admin' ? 'Restricted' : 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 12, color: '#94a3b8' }}>
                      <Trash2 size={16} style={{ cursor: 'pointer' }} onClick={() => handleDeleteUser(user._id)} />
                      <ShieldAlert size={16} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="admin-view">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="trend-card">
          <h3>Generate New Report</h3>
          <div className="admin-form-group" style={{ marginTop: 20 }}>
            <label>Report Type</label>
            <select className="admin-form-select">
              <option>Analytics Summary</option>
              <option>Compliance Audit</option>
              <option>Risk Distribution</option>
              <option>User Activity</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Date Range</label>
            <input type="date" className="admin-form-input" defaultValue="2024-01-01" />
          </div>
          <div className="admin-form-group">
            <label>Region</label>
            <select className="admin-form-select">
              <option>All Regions</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={() => handleGenerateReport({
              title: `System Export ${new Date().toLocaleDateString()}`,
              type: 'analytics',
              format: 'pdf',
              filters: filters
            })}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate PDF Report'} <BarChart3 size={16} />
          </button>
        </div>

        <div className="system-table-card">
          <div className="table-header"><h3>Recent Reports</h3></div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No reports found</td></tr>
              ) : (
                reports.map(rpt => (
                  <tr key={rpt._id}>
                    <td><strong>{rpt.reportId}</strong></td>
                    <td>{rpt.title}</td>
                    <td>{new Date(rpt.createdAt).toLocaleDateString()}</td>
                    <td><Download size={16} color="var(--brand-primary)" style={{ cursor: 'pointer' }} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ContentManagementView = () => (
    <div className="admin-view">
      <div className="system-table-card">
        <div className="table-header">
          <h3>Educational Content Management</h3>
          <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => {
            setFormData({ type: 'educational-article', category: 'domestic-violence', workflow: { status: 'draft' } });
            setEditingItem(null);
            setShowContentModal(true);
          }}><Plus size={16} /> New Resource</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Content ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map(item => (
              <tr key={item._id}>
                <td><code>{item.contentId}</code></td>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td><span className="mood-chip" style={{ background: '#dcfce7', color: '#15803d' }}>Published</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 12, color: '#94a3b8' }}>
                    <Edit size={16} style={{ cursor: 'pointer' }} onClick={() => {
                      setEditingItem(item);
                      setFormData(item);
                      setShowContentModal(true);
                    }} />
                    <Trash2 size={16} style={{ cursor: 'pointer' }} onClick={() => handleDeleteContent(item._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="admin-view">
      <div className="system-table-card">
        <div className="table-header">
          <h3>System Notifications</h3>
          <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={handleClearNotifications}>Clear All</button>
        </div>
        <div style={{ padding: '0 24px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
              <Bell size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>No new notifications at this time.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif._id} style={{
                padding: '20px 0',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: notif.type === 'alert' ? '#fee2e2' : '#f1f5f9',
                  color: notif.type === 'alert' ? '#ef4444' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {notif.type === 'alert' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{notif.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>{notif.message}</p>
                </div>
                <Trash2 size={16} color="#94a3b8" style={{ cursor: 'pointer', marginTop: 4 }} onClick={() => handleDeleteNotification(notif._id)} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="admin-view">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="trend-card">
          <h3>General Configuration</h3>
          <div className="admin-form-group" style={{ marginTop: 24 }}>
            <label>System Operating Mode</label>
            <select className="admin-form-select" value={systemSettings.systemMode} onChange={(e) => setSystemSettings({ ...systemSettings, systemMode: e.target.value })}>
              <option>Standard</option>
              <option>Emergency Mode (Restricted)</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="admin-form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label style={{ margin: 0 }}>Allow New Registrations</label>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Toggle public user signup</p>
            </div>
            <input type="checkbox" checked={systemSettings.registrationAllowed} onChange={(e) => setSystemSettings({ ...systemSettings, registrationAllowed: e.target.checked })} />
          </div>
          <div className="admin-form-group">
            <label>Data Retention Policy (Days)</label>
            <input type="number" className="admin-form-input" value={systemSettings.auditRetentionDays} onChange={(e) => setSystemSettings({ ...systemSettings, auditRetentionDays: e.target.value })} />
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={handleSaveSettings}><Save size={16} /> Save Changes</button>
        </div>

        <div className="trend-card">
          <h3>Security & Alerts</h3>
          <div className="admin-form-group">
            <label>Risk Alert Threshold (%)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="range" style={{ flex: 1 }} value={systemSettings.alertThreshold} onChange={(e) => setSystemSettings({ ...systemSettings, alertThreshold: e.target.value })} />
              <strong style={{ minWidth: 40 }}>{systemSettings.alertThreshold}%</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Triggers high-priority admin notifications for risk scores above this limit.</p>
          </div>
          <div className="admin-form-group">
            <label>Regional Restriction Policy</label>
            <select className="admin-form-select" value={systemSettings.regionRestriction} onChange={(e) => setSystemSettings({ ...systemSettings, regionRestriction: e.target.value })}>
              <option>None (All Access)</option>
              <option>Delhi/NCR Only</option>
              <option>India Only</option>
            </select>
          </div>
          <div className="system-table-card" style={{ padding: 16, background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem' }}>Active Security Protocols</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>JWT Token Rotation Enabled</li>
              <li>AES-256 Vault Encryption Active</li>
              <li>Admin Concurrent Session Limit: 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── MAIN LAYOUT ─── */

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={aramLogo} alt="ARAM" style={{ height: 32 }} />
          <div style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 800, letterSpacing: 2, marginTop: 4 }}>ADMIN CONSOLE</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}>
            <Users size={20} /> <span>Users & Roles</span>
          </Link>
          <Link to="/admin/reports" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}>
            <FileText size={20} /> <span>Reports</span>
          </Link>
          <Link to="/admin/content" className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}>
            <MessageSquare size={20} /> <span>Content Management</span>
          </Link>
          <Link to="/admin/notifications" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}>
            <Bell size={20} /> <span>Notifications</span>
          </Link>
          <Link to="/admin/settings" className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} /> <span>Settings</span>
          </Link>
        </nav>
        <div className="sidebar-nav" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          <div className="nav-item" onClick={handleQuickExit} style={{ color: '#ef4444' }}>
            <LogOut size={20} /> <span>Sign Out</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h2>
            <ChevronRight size={18} color="#94a3b8" />
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Overview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="trust-badge">
              <CheckCircle size={12} /> SYSTEM SECURE
            </div>
            <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>System Admin</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Operations</div>
              </div>
              <div className="nav-avatar"><Users size={16} /></div>
            </div>
          </div>
        </header>

        <div className="admin-content-scroller">
          {(() => {
            console.log('Rendering view for:', activeTab);
            switch (activeTab) {
              case 'dashboard': return <DashboardView />;
              case 'users': return <UserManagementView />;
              case 'reports': return <ReportsView />;
              case 'content': return <ContentManagementView />;
              case 'notifications': return <NotificationsView />;
              case 'settings': return <SettingsView />;
              default: return <DashboardView />;
            }
          })()}
        </div>
      </main>

      {/* User Management Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add New System User"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-form-group">
            <label>Full Name</label>
            <input className="admin-form-input" placeholder="e.g. John Doe" onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Email Address</label>
            <input className="admin-form-input" type="email" placeholder="john@example.com" onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input className="admin-form-input" type="password" placeholder="••••••••" onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>System Role</label>
            <select className="admin-form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="victim">Victim</option>
              <option value="witness">Witness</option>
              <option value="healthcare_worker">Healthcare Worker</option>
              <option value="admin">System Admin</option>
            </select>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleCreateUser(formData)}>Create Account</button>
        </div>
      </Modal>

      {/* Content Management Modal */}
      <Modal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title={editingItem ? 'Edit Resource' : 'Create New Resource'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
          <div className="admin-form-group">
            <label>Title</label>
            <input className="admin-form-input" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Type</label>
            <select className="admin-form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="educational-article">Educational Article</option>
              <option value="safety-guide">Safety Guide</option>
              <option value="legal-information">Legal Information</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Category</label>
            <select className="admin-form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              <option value="domestic-violence">Domestic Violence</option>
              <option value="legal-rights">Legal Rights</option>
              <option value="safety-planning">Safety Planning</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Body Content</label>
            <textarea
              className="admin-form-input"
              style={{ minHeight: 150 }}
              value={formData.content?.body || ''}
              onChange={e => setFormData({ ...formData, content: { ...formData.content, body: e.target.value } })}
            />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleSaveContent(formData)}>
            {editingItem ? 'Update Content' : 'Publish Content'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;