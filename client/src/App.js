/** @format */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApplications } from "../src/redux/applicationSlice";
import { getCurrentUser, getAllUsers } from "../src/redux/userSlice";
import { getAllOffers } from "../src/redux/offerSlice";

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Navbarr from "./components/Navbarr";
import Login from "./components/login";
import Signup from "./components/signup";
import About from "./components/About";
import Profile from "./components/Profile";
import Offers from "./components/Offers";
import Footer from "./components/Footer";
import Applications from "./components/Applications";

function App() {
  const dispatch = useDispatch();
  const [ping, setPing] = useState(false);
  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getApplications());
    dispatch(getAllOffers());
    dispatch(getAllUsers());
  }, [ping]);

  const user = useSelector((state) => state.user?.user);
  const isLoggedIn = !!user?._id;
  return (
    <div className="App">
      <Navbarr />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/profile" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/profile" /> : <Signup />}
        />
        <Route path="/about" element={<About />} />

        {/* Private routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile ping={ping} setPing={setPing} />
            </PrivateRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <Applications ping={ping} setPing={setPing} />
            </PrivateRoute>
          }
        />

        {/* Role-protected route: only interns allowed */}
        <Route
          path="/offers"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={["intern", "student"]}>
                <Offers ping={ping} setPing={setPing} />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
