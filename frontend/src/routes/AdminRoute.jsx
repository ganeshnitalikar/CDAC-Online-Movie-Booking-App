import React, { Children } from "react";
import ProtectedRoute from "./ProtectedRoute";
const AdminRoute = ({ Children }) => {
  return <ProtectedRoute requiredRole="admin">{Children}</ProtectedRoute>;
};

export default AdminRoute;
