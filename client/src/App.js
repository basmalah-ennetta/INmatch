/** @format */

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import About from "./components/About";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers, getCurrentUser } from "./redux/userSlice";

function App() {
  const isAuth = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [ping, setping] = useState(false);
  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getAllUsers());
  });

  return (
    <div className="App">
      <Routes>
        {/* Default route */}
        <Route path="/login" element={<Login />} />
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* About page */}
        <Route path="/about" element={<About />} />
        {/* Profile page */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
