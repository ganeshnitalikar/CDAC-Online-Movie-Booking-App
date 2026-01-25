// import React from 'react'
// import { Navigate, Routes, useLocation } from "react-router-dom";
// import { ROUTES } from "../constants/routes";
// import { useAuth } from "../hooks/useAuth";
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
//   }

//   if (requiredRole && user?.role !== requiredRole) {
//     const redirectPath =
//       user?.role === "admin"
//         ? ROUTES.ADMIN_DASHBOARD
//         : user?.role === "owner"
//         ? ROUTES.OWNER_DASHBOARD
//         : user?.role === "user"
//         ? ROUTES.USER_DASHBOARD
//         : ROUTES.HOME;
//     return <Navigate to={redirectPath} replace />;
//   }
//   return children;
// };

// export default ProtectedRoute

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { ROUTES } from "../constants/routes";
// import { useAuth } from "../hooks/useAuth";

// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, isAuthenticated } = useAuth();
//   const location = useLocation();

//   const token = localStorage.getItem("token");

//   // ❌ Not authenticated at all
//   if (!isAuthenticated || !token || !user) {
//     return (
//       <Navigate
//         to={ROUTES.LOGIN}
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   // ❌ Role mismatch
//   if (requiredRole && user.role !== requiredRole) {
//     const redirectPath =
//       user.role === "admin"
//         ? ROUTES.ADMIN_DASHBOARD
//         : user.role === "owner"
//         ? ROUTES.OWNER_DASHBOARD
//         : ROUTES.USER_DASHBOARD;

//     return <Navigate to={redirectPath} replace />;
//   }

//   // ✅ All good
//   return children;
// };

// export default ProtectedRoute;


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

  // ⚠ role from backend is UPPERCASE
  if (requiredRole && user.role !== requiredRole.toUpperCase()) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
