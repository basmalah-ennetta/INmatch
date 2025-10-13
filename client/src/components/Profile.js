/** @format */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser, getCurrentUser } from "../redux/userSlice"; // Make sure you have an action for updating Redux state
import { FaLinkedin, FaGlobe, FaGithub, FaFileAlt } from "react-icons/fa";
import ProjectCard from "./ProjectCard";
import InternshipOfferCard from "./OfferCard";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    phonenumber: user?.phonenumber || "",
    address: user?.address || "",
    linkedin: user?.linkedin || "",
    website: user?.website || "",
    github: user?.github || "",
    resume: user?.resume || "",
    description: user?.description || "",
    skills: user?.skills || [],
  });

  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [offers, setOffers] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/user/current", {
          headers: { Authorization: token },
        });
        setFormData(res.data.user); // replace your local form state
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resultAction = await dispatch(
        updateUser({ id: user._id, updates: formData })
      );
      if (updateUser.fulfilled.match(resultAction)) {
        setIsEditing(false);
      } else {
        alert("Failed to save changes.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      { name: "", description: "", image: "", liveDemo: "" },
    ]);
  };

  const handleAddOffer = () => {
    setOffers([
      ...offers,
      { title: "", company: "", location: "", description: "" },
    ]);
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      { diploma: "", university: "", address: "", date: "" },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-gray-800 flex">
      {/* ==== Sidebar ==== */}
      <div className="w-1/5 bg-indigo-900 text-white flex flex-col items-center py-10 space-y-6">
        <h1 className="text-2xl font-bold">PROFILE</h1>
        <nav className="flex flex-col gap-3 text-sm font-medium w-full px-6">
          <button className="hover:bg-indigo-700 p-2 rounded-lg text-left">
            Account Information
          </button>
          <button className="hover:bg-indigo-700 p-2 rounded-lg text-left">
            {user?.role === "intern" ? "Projects" : "Internship Offers"}
          </button>
          {user?.role === "intern" && (
            <button className="hover:bg-indigo-700 p-2 rounded-lg text-left">
              Education
            </button>
          )}
        </nav>
      </div>

      {/* ==== Main Section ==== */}
      <div className="w-3/5 p-10 space-y-8">
        {/* ==== Account Info ==== */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-indigo-800">
              Account Information
            </h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isEditing
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profilePic || "https://avatar.iran.liara.run/public"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
              />
              {isEditing && (
                <input
                  type="file"
                  className="absolute bottom-0 left-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={handleFileChange}
                />
              )}
            </div>

            <div className="flex flex-col gap-2 text-sm w-full">
              <div className="flex gap-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`border-b outline-none w-1/2 ${
                    isEditing
                      ? "border-indigo-400"
                      : "border-transparent bg-transparent"
                  }`}
                  placeholder="First Name"
                />
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`border-b outline-none w-1/2 ${
                    isEditing
                      ? "border-indigo-400"
                      : "border-transparent bg-transparent"
                  }`}
                  placeholder="Last Name"
                />
              </div>

              <input
                value={user?.email}
                disabled
                className="bg-gray-100 border-b border-gray-300 outline-none w-full text-gray-500 cursor-not-allowed"
              />

              <input
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Phone Number"
                className={`border-b outline-none w-full ${
                  isEditing
                    ? "border-indigo-400"
                    : "border-transparent bg-transparent"
                }`}
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Address"
                className={`border-b outline-none w-full ${
                  isEditing
                    ? "border-indigo-400"
                    : "border-transparent bg-transparent"
                }`}
              />
            </div>
          </div>
        </div>

        {/* ==== Projects / Internship Offers ==== */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {user?.role === "intern" ? "Projects" : "Internship Offers"}
            </h3>
            <button
              onClick={
                user?.role === "intern" ? handleAddProject : handleAddOffer
              }
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              + Add
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.role === "intern"
              ? projects.map((p, i) => <ProjectCard key={i} project={p} />)
              : offers.map((o, i) => <InternshipOfferCard key={i} offer={o} />)}
          </div>
        </div>

        {/* ==== Education ==== */}
        {user?.role === "intern" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Education</h3>
              <button
                onClick={handleAddEducation}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {education.map((ed, i) => (
                <div
                  key={i}
                  className="border border-gray-200 p-3 rounded-lg text-sm"
                >
                  <p className="font-semibold">{ed.diploma}</p>
                  <p>{ed.university}</p>
                  <p>{ed.address}</p>
                  <p>{ed.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==== Right Section ==== */}
      <div className="w-1/5 bg-indigo-50 p-6 flex flex-col gap-6">
        <div>
          <h4 className="font-semibold mb-2">Social Links</h4>
          <div className="flex flex-col gap-2">
            {["linkedin", "website", "github", "resume"].map(
              (field) =>
                (user?.role === "intern" ||
                  field === "linkedin" ||
                  field === "website") && (
                  <div
                    key={field}
                    className="flex items-center gap-2 bg-white p-2 rounded-lg shadow"
                  >
                    {field === "linkedin" && (
                      <FaLinkedin className="text-blue-700" />
                    )}
                    {field === "website" && (
                      <FaGlobe className="text-green-700" />
                    )}
                    {field === "github" && <FaGithub />}
                    {field === "resume" && (
                      <FaFileAlt className="text-gray-700" />
                    )}
                    {isEditing ? (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="outline-none border-b border-indigo-400 bg-transparent text-sm flex-1"
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                      />
                    ) : (
                      <a
                        href={formData[field] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 hover:underline truncate"
                      >
                        {formData[field] || `Add ${field}`}
                      </a>
                    )}
                  </div>
                )
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded-lg p-2 text-sm"
              rows={4}
            />
          ) : (
            <p className="text-sm text-gray-600">
              {formData.description || "No description provided."}
            </p>
          )}
        </div>

        {user?.role === "intern" && (
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            {isEditing ? (
              <input
                name="skills"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full border-b border-indigo-400 outline-none text-sm"
                placeholder="Comma-separated (e.g. React, Node.js)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
