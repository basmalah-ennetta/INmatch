/** @format */

import React, { useState } from "react";
import { loginUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [login, setlogin] = useState({ email: "", password: "" });
   const [errorMsg, setErrorMsg] = useState(""); // ✅ new state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear old error

    const resultAction = await dispatch(loginUser(login));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/about");
    } else {
      setErrorMsg(resultAction.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-6xl gap-8 lg:gap-12">
        {/* Left Section: Avatar + Title */}
        <div className="flex flex-col items-center justify-center text-center w-full lg:w-1/3">
          {/* Avatar */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-xl overflow-hidden">
              <img
                src="https://avatar.iran.liara.run/public"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-6 w-6 h-6 bg-green-400 rounded-full border-4 border-gray-900 animate-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-3">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            Sign in to your account to continue your journey with us.
          </p>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-2/3 xl:w-1/2 bg-white/10 backdrop-blur-md p-8 lg:p-12 rounded-2xl shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-indigo-500/30">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Sign In
          </h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-left text-sm font-medium text-gray-200 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                onChange={(e) => setlogin({ ...login, email: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-gray-500 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 hover:border-indigo-300 shadow-md"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  onChange={(e) =>
                    setlogin({ ...login, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/5 border border-gray-500 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 hover:border-indigo-300 shadow-md pr-12"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 text-gray-400 hover:text-indigo-300 transition flex items-center justify-center h-full"
                >
                  {passwordVisible ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>
            {/* ✅ Error Message */}
            {errorMsg && (
              <div className="text-red-400 text-sm text-center font-medium mt-2">
                {errorMsg === "user does not exist"
                  ? "No account with this email — sign up instead."
                  : errorMsg}
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">
                  New to our platform?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up as Link */}
          <div className="text-center">
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-300"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
