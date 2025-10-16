/** @format */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";

const Navbarr = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo + Site Name */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/internship_logo.png"
          alt="logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-700 leading-none mb-0 flex items-center">
          Intern<span className="text-indigo-500">Ship</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <span
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
        >
          Profile
        </span>

        {user?.role === "intern" && (
          <span
            onClick={() => navigate("/offers")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
          >
            Offers
          </span>
        )}

        <span
          onClick={() => navigate("/applications")}
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
        >
          Applications
        </span>

        {/* Conditional Login / Logout Button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              LogIn
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              SignIn
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbarr;
