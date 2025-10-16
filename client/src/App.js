/** @format */
import React, { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import {
  getApplications
} from "../src/redux/applicationSlice";
import { getCurrentUser, getAllUsers } from "../src/redux/userSlice";
import { getAllOffers } from "../src/redux/offerSlice";

import "./App.css";
import { Routes, Route } from "react-router-dom";
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


  return (
    <div className="App">
      <Navbarr />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Login />} />
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* About page */}
        <Route path="/about" element={<About />} />
        {/* Applications page */}
        <Route path="/applications" element={<Applications ping={ping} setPing={setPing} />} />
        {/* Profile page */}
        <Route path="/profile" element={<Profile ping={ping} setPing={setPing} />} />
        {/* Offers page */}
        <Route path="/offers" element={<Offers ping={ping} setPing={setPing} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
