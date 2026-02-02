import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
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
        // Redirect to their own dashboard if they try to access something disallowed
        const dashboardMap = {
            admin: '/admin',
            healthcare: '/healthcare',
            witness: '/witness',
            victim: '/victim-dashboard'
        };
        return <Navigate to={dashboardMap[user.role] || '/'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
