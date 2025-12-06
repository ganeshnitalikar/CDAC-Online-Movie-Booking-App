import React from 'react'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  return <div>Protected Route</div>;
};

export default ProtectedRoute