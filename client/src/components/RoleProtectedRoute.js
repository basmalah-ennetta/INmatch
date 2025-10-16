// src/components/RoleProtectedRoute.js
/** @format */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const user = useSelector((state) => state.user?.user);
  const userRole = user?.role;

  return allowedRoles.includes(userRole) ? children : <Navigate to="/profile" />;
}
