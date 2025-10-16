// src/components/PrivateRoute.js
/** @format */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.user?.user);
  const isLoggedIn = !!user?._id;

  return isLoggedIn ? children : <Navigate to="/" />;
}
