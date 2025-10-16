/** @format */
import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-8">
      {/* Bottom Line */}
      <div className="text-center text-gray-500 mt-8 text-sm">
        &copy; {new Date().getFullYear()} InternShip. All rights reserved.
      </div>
    </footer>
  );
}
