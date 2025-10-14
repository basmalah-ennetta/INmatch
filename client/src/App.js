/** @format */

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import About from "./components/About";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Applications from "./components/Applications";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Default route */}
        <Route path="/login" element={<Login />} />
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* About page */}
        <Route path="/about" element={<About />} />
        {/* Applications page */}
        <Route path="/applications" element={<Applications />} />
        {/* Profile page */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
