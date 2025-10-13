/** @format */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBolt, FaSmileBeam, FaHandshake } from "react-icons/fa";



export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white px-6 py-16 flex justify-center items-center">
      <div className="max-w-6xl w-full">
        {/* Intro Section */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-20">
          {/* Graphic */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={"/logo192.png"}
              alt="About illustration"
              className="max-w-sm md:max-w-md drop-shadow-2xl animate-fadeIn"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5">
            <h1 className="text-5xl font-extrabold text-indigo-300 tracking-tight">
              About <span className="text-white">[Your Website Name]</span>
            </h1>
            <p className="text-lg text-gray-300 font-light">
              <span className="text-indigo-400 font-semibold">
                Swipe Your Way to Your Next Opportunity.
              </span>
              <br />
              We’re reimagining how students and companies connect — through a
              fun, intuitive, and human approach.
            </p>
            <p className="italic text-gray-400">
              Finding the right match should feel exciting — not exhausting.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-indigo-300 mb-8 text-center">
            How It Works 🚀
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* For Interns */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Interns & Job Seekers
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <span className="text-indigo-400 font-semibold">
                    🧭 Create Your Profile:
                  </span>{" "}
                  Highlight your skills, passions, and goals — make your profile
                  pop!
                </li>
                <li>
                  <span className="text-indigo-400 font-semibold">
                    💡 Discover & Swipe:
                  </span>{" "}
                  See internships that excite you.{" "}
                  <span className="text-gray-400">
                    Swipe Right = Interested, Swipe Left = Pass.
                  </span>
                </li>
                <li>
                  <span className="text-indigo-400 font-semibold">
                    💬 Match & Chat:
                  </span>{" "}
                  If the company likes you back, it’s a match! Start chatting and
                  take the next step.
                </li>
              </ul>
            </div>

            {/* For Companies */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Companies & Enterprises
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <span className="text-indigo-400 font-semibold">
                    🏢 Build Your Company Profile:
                  </span>{" "}
                  Showcase your culture, values, and open roles with personality.
                </li>
                <li>
                  <span className="text-indigo-400 font-semibold">
                    🔍 Discover Talent:
                  </span>{" "}
                  Swipe through curated profiles that fit your team vibe.
                </li>
                <li>
                  <span className="text-indigo-400 font-semibold">
                    🤝 Match & Hire:
                  </span>{" "}
                  When both sides swipe right, connect instantly and make
                  something great together.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold text-indigo-300">
            Our Philosophy: <span className="text-white">Go Ahead, Judge the Cover.</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            We believe the best matches start with a spark. Swipe for the
            story, stay for the opportunity. Every swipe could be the beginning
            of a career-changing connection.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: <FaBolt />, title: "Speed", desc: "Connect in seconds, not hours of scrolling." },
            { icon: <FaSmileBeam />, title: "Fun", desc: "Make your search playful and gamified." },
            { icon: <FaHandshake />, title: "Mutual Respect", desc: "Only matched users can chat — no spam." },
            { icon: <FaBolt />, title: "Quality", desc: "Smart matches over endless lists." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-2xl shadow-lg hover:bg-indigo-500/10 transition-all duration-300"
            >
              <div className="text-4xl text-indigo-300 mb-3 mx-auto">{item.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
