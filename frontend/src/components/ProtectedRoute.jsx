import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    useEffect(() => {
        // ... (rest of the code)
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>Loading...</div>;
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                fontFamily: 'Inter, sans-serif',
                textAlign: 'center',
                padding: '24px'
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    background: '#fee2e2',
                    color: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Access Restricted</h2>
                <p style={{ color: '#64748b', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
                    Your current account (<strong>{user.role}</strong>) does not have permission to access this area.
                    Please log out to switch to an administrative or healthcare account.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-ghost"
                        style={{ padding: '12px 24px', border: '1px solid #e2e8f0' }}
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            window.location.href = '/login';
                        }}
                        className="btn-primary"
                        style={{ padding: '12px 24px' }}
                    >
                        Logout & Switch
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
