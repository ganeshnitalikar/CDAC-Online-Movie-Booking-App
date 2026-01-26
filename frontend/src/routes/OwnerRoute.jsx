import React from 'react'
import ProtectedRoute from "./ProtectedRoute";
const OwnerRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="THEATER_OWNER">{children}</ProtectedRoute>;
};

export default OwnerRoute