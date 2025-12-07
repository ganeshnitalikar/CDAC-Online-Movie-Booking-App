import React, { Children } from "react";
import ProtectedRoute from "./ProtectedRoute";
const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

export default AdminRoute;