/** @format */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState("intern");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleAddSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 px-4 py-6">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-6 lg:gap-8">
        {/* Left Section: Avatar + Title - More Compact */}
        <div className="flex flex-col items-center justify-center text-center w-full lg:w-1/3 mb-4 lg:mb-0">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-400 shadow-xl overflow-hidden">
              <img
                src="https://avatar.iran.liara.run/public"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-4 w-5 h-5 bg-green-400 rounded-full border-4 border-gray-900 animate-pulse"></div>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
            Join Us
          </h2>
          <p className="text-sm text-gray-300 max-w-xs">
            Create your account and start your journey with us today.
          </p>
        </div>

        {/* Right Section: Form - More Compact */}
        <div className="w-full lg:w-2/3 bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white text-center mb-6">
            Sign Up
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                />
              </div>
            </div>

            {/* Email - Compact */}
            <div>
              <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
              />
            </div>

            {/* Password - Compact */}
            <div>
              <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-2 text-gray-400 hover:text-indigo-300 transition flex items-center justify-center h-full"
                >
                  {passwordVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Phone Number - Compact */}
            <div>
              <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+123 456 7890"
                className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
              />
            </div>

            {/* Role - Compact */}
            <div>
              <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
              >
                <option value="intern" style={{ color: "black" }}>Intern</option>
                <option value="entreprise" style={{ color: "black" }}>Entreprise</option>
              </select>
            </div>

            {/* Conditional Fields - Compact */}
            {role === "entreprise" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tech, Finance"
                    className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-left text-xs font-medium text-gray-200 mb-1">
                    Skills
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 rounded-lg bg-white/5 border border-gray-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button - Compact */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm mt-4"
            >
              Sign Up
            </button>
          </form>

          {/* Divider - Compact */}
          <div className="mt-6 mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign In as Link - Compact */}
          <div className="text-center">
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-300 text-sm"
            >
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}