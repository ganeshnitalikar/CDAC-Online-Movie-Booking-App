

 import React from 'react'
 import { Navigate, Routes, useLocation } from "react-router-dom";
 import { ROUTES } from "../constants/routes";
 import { useAuth } from "../hooks/useAuth";
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("authToken");

  if (!isAuthenticated || !token || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole.toUpperCase()) {

    const redirectPath =
      user.role === 'ADMIN'
        ? ROUTES.ADMIN_DASHBOARD
        : user.role === 'THEATER_OWNER'
        ? ROUTES.OWNER_DASHBOARD
        : user.role === 'USER'
        ? ROUTES.USER_DASHBOARD
        : ROUTES.HOME;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
