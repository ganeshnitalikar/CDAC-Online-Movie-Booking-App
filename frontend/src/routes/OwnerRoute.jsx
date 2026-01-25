import React from 'react'
import ProtectedRoute from "./ProtectedRoute";
const OwnerRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="theater_owner">{children}</ProtectedRoute>;
};

export default OwnerRoute