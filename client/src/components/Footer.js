/** @format */
import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo / Branding */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white">[Your Website Name]</h3>
          <p className="text-gray-400 mt-1">Connecting talent with opportunity, one swipe at a time.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 mb-6 md:mb-0">
          <a href="#landing" className="hover:text-indigo-400 transition-colors">Home</a>
          <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
          <a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-2xl">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
            <FaLinkedin />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
            <FaGithub />
          </a>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 text-sm">
        &copy; {new Date().getFullYear()} [Your Website Name]. All rights reserved.
      </div>
    </footer>
  );
}
