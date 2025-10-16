/** @format */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";
import { updateUser, getCurrentUser } from "../redux/userSlice";
import {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffersByCompany,
} from "../redux/offerSlice";
import {
  FaLinkedin,
  FaGlobe,
  FaGithub,
  FaTrash,
  FaEdit,
  FaSave,
  FaBars,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";

export default function Profile({ ping, setPing }) {
  const user = useSelector((state) => state.user?.user);
  const offersList = useSelector((state) => state.offer?.offers);
  const companyOffers = Array.isArray(offersList)
    ? offersList.filter((offer) => offer.companyId === user?._id)
    : [];

  const dispatch = useDispatch();

  console.log("user", user);
  console.log("offersList", offersList);

  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editingProjects, setEditingProjects] = useState({});
  const [editingEducation, setEditingEducation] = useState({});
  const [editingOffers, setEditingOffers] = useState({});
  const [offerEdits, setOfferEdits] = useState({}); // store edits temporarily

  const [newProject, setNewProject] = useState(null);
  const [newEducation, setNewEducation] = useState(null);
  const [newOffer, setNewOffer] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch, ping]);

  const role = formData.role || user?.role;

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOffersByCompany(user._id));
    }
  }, [dispatch, user, ping]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await dispatch(
        updateUser({ id: user._id, updates: formData })
      );
      if (updateUser.fulfilled.match(res)) setIsEditing(false);
      else alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };
  const location = useLocation();
  const navigate = useNavigate();

  // ===== PROJECTS =====
  const handleAddProject = () =>
    setNewProject({ title: "", description: "", liveDemo: "" });
  const toggleEditProject = (id) =>
    setEditingProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  const changeProjectField = (id, field, value) => {
    const updated = formData.projects.map((p, i) =>
      p._id === id || i === id ? { ...p, [field]: value } : p
    );
    setFormData({ ...formData, projects: updated });
  };
  const handleUpdateProject = async (p) => {
    await dispatch(
      updateUser({ id: user._id, updates: { projects: formData.projects } })
    );
    toggleEditProject(p._id);
  };
  const handleDeleteProject = async (id) => {
    const updated = formData.projects.filter(
      (p, i) => p._id !== id && i !== id
    );
    await dispatch(
      updateUser({ id: user._id, updates: { projects: updated } })
    );
    setFormData({ ...formData, projects: updated });
  };

  // ===== EDUCATION =====
  const handleAddEducation = () =>
    setNewEducation({ diploma: "", university: "", location: "", date: "" });
  const toggleEditEducation = (id) =>
    setEditingEducation((prev) => ({ ...prev, [id]: !prev[id] }));
  const changeEducationField = (id, field, value) => {
    const updated = formData.education.map((ed, i) =>
      ed._id === id || i === id ? { ...ed, [field]: value } : ed
    );
    setFormData({ ...formData, education: updated });
  };
  const handleUpdateEducation = async (ed) => {
    await dispatch(
      updateUser({ id: user._id, updates: { education: formData.education } })
    );
    toggleEditEducation(ed._id);
  };
  const handleDeleteEducation = async (id) => {
    const updated = formData.education.filter(
      (ed, i) => ed._id !== id && i !== id
    );
    await dispatch(
      updateUser({ id: user._id, updates: { education: updated } })
    );
    setFormData({ ...formData, education: updated });
  };

  // ===== OFFERS =====

  const toggleEditOffer = (offer) => {
    setEditingOffers((prev) => ({ ...prev, [offer._id]: !prev[offer._id] }));
    setOfferEdits((prev) => ({ ...prev, [offer._id]: { ...offer } }));
  };

  const changeOfferField = (id, field, value) => {
    setOfferEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };
  // === Handlers for Offers ===
  const handleAddNewOffer = () =>
    setNewOffer({ title: "", description: "", location: "", payment: "", type: "", duration: "" });

  const handleSaveNewOffer = async () => {
    if (!user || !newOffer) return;
    await dispatch(createOffer({ ...newOffer, companyId: user._id }));
    setNewOffer(null);
    setPing((prev) => !prev); // refresh offers list
  };

  const saveOffer = async (id) => {
    await dispatch(updateOffer({ id, updates: offerEdits[id] }));
    setEditingOffers((prev) => ({ ...prev, [id]: false }));
    setOfferEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setPing((prev) => !prev); // refresh list
  };

  const handleDeleteOfferClick = async (id) => {
    await dispatch(deleteOffer(id));
    setPing((prev) => !prev); // refresh after deletion
  };

  const projects = formData.projects || [];
  const education = formData.education || [];

  const handleNavClick = (path) => {
    if (path) navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-gray-800 flex flex-col lg:flex-row">
      {/* Mobile Top Bar (hamburger) */}
      <div className="lg:hidden flex items-center justify-between bg-indigo-900 text-white px-4 py-3">
        <h1 className="text-lg font-bold">PROFILE</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-indigo-900 text-white flex flex-col py-10 space-y-6 transition-all duration-300 z-50
          ${
            sidebarOpen
              ? "fixed left-0 top-0 h-full w-4/5 sm:w-1/2 translate-x-0 opacity-100"
              : "fixed -left-full top-0 h-full w-4/5 sm:w-1/2 translate-x-0 opacity-0"
          }
          lg:static lg:w-1/5 lg:translate-x-0 lg:opacity-100 lg:h-screen lg:fixed`}
      >
        <div className="px-4 overflow-y-auto">
          <div className="flex items-center justify-between lg:justify-center">
            <h1
              className={`text-2xl font-bold text-center transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
              }`}
            >
              PROFILE
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-xl"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-3 text-sm font-medium w-full mt-6">
            <button
              onClick={() => handleNavClick("/profile")}
              className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
                location.pathname === "/profile"
                  ? "bg-indigo-700 text-white"
                  : "hover:bg-indigo-700"
              }`}
            >
              <FaUser />
              <span
                className={`${sidebarOpen ? "inline" : "hidden lg:inline"}`}
              >
                Account Information
              </span>
            </button>
            <button
              onClick={() => handleNavClick("/applications")}
              className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
                location.pathname === "/applications"
                  ? "bg-indigo-700 text-white"
                  : "hover:bg-indigo-700"
              }`}
            >
              <FaFileAlt />
              <span
                className={`${sidebarOpen ? "inline" : "hidden lg:inline"}`}
              >
                {role === "intern"
                  ? "My Applications"
                  : "Applications Received"}
              </span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content (scrollable independently on desktop) */}
      <main className="flex-1 p-10 space-y-8 transition-all duration-300 lg:ml-[20%] lg:overflow-y-auto lg:max-h-screen scrollbar-hide">
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
                src={"https://avatar.iran.liara.run/public"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
              />
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
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h3 className="text-xl font-semibold text-indigo-800 tracking-wide">
              {role === "intern" ? "Projects" : "Internship Offers"}
            </h3>
            <button
              onClick={role === "intern" ? handleAddProject : handleAddNewOffer}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              + Add
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Project Form */}
            {role === "intern" && newProject && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Project title"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Project description"
                />
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newProject.liveDemo}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveDemo: e.target.value })
                  }
                  placeholder="Live demo URL"
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={async () => {
                      const updatedProjects = [
                        ...(formData.projects || []),
                        newProject,
                      ];
                      await dispatch(
                        updateUser({
                          id: user._id,
                          updates: { projects: updatedProjects },
                        })
                      );
                      setFormData({ ...formData, projects: updatedProjects });
                      setNewProject(null);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setNewProject(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Projects */}
            {role === "intern" &&
              projects.map((p) => (
                <div
                  key={p._id || Math.random()}
                  className="relative bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  {editingProjects[p._id] ? (
                    <>
                      <input
                        className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                        value={p.title || ""}
                        onChange={(e) =>
                          changeProjectField(p._id, "title", e.target.value)
                        }
                        placeholder="Project title"
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
                        value={p.description || ""}
                        onChange={(e) =>
                          changeProjectField(
                            p._id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                      />
                      <input
                        className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                        value={p.liveDemo || ""}
                        onChange={(e) =>
                          changeProjectField(p._id, "liveDemo", e.target.value)
                        }
                        placeholder="Live demo URL"
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-900">{p.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {p.description}
                      </p>
                      {p.liveDemo && (
                        <a
                          href={p.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm no-underline hover:bg-indigo-500 transition-all"
                        >
                          Live Demo
                        </a>
                      )}
                    </>
                  )}
                  <div className="absolute top-3 right-3 flex gap-3">
                    {editingProjects[p._id] ? (
                      <>
                        <button
                          onClick={() => handleUpdateProject(p)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => toggleEditProject(p._id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleEditProject(p._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

            {/* New Offer Form */}
            {role !== "intern" && newOffer && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newOffer.title}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, title: e.target.value })
                  }
                  placeholder="Offer title"
                />
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newOffer.location}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, location: e.target.value })
                  }
                  placeholder="Location"
                />
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newOffer.duration || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, duration: e.target.value })
                  }
                  placeholder="Duration: (e.g., 6 months)"
                />
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newOffer.type || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, type: e.target.value })
                  }
                  placeholder="Type (e.g., Remote/ Hybrid/ in-office)"
                />
                <input
                  className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                  value={newOffer.payment || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, payment: e.target.value })
                  }
                  placeholder="Payment (e.g.,$1000/month )"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
                  value={newOffer.description}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, description: e.target.value })
                  }
                  placeholder="Description"
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSaveNewOffer}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setNewOffer(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Offers */}
            {companyOffers.map((o) => (
              <div
                key={o._id}
                className="relative bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                {editingOffers[o._id] ? (
                  <>
                    <input
                      className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                      value={offerEdits[o._id]?.title || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "title", e.target.value)
                      }
                      placeholder="Offer title"
                    />
                    <input
                      className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                      value={offerEdits[o._id]?.location || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "location", e.target.value)
                      }
                      placeholder="Location"
                    />
                    <input
                      className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                      value={offerEdits[o._id]?.duration || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "duration", e.target.value)
                      }
                      placeholder="Duration (e.g., 2 months/ 3 moths/ 1 year)"
                    />
                    <input
                      className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                      value={offerEdits[o._id]?.type || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "type", e.target.value)
                      }
                      placeholder="Type (e.g., Internship / Full-time)"
                    />
                    <input
                      className="w-full border-b border-gray-300 mb-3 outline-none bg-transparent text-gray-700"
                      value={offerEdits[o._id]?.payment || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "payment", e.target.value)
                      }
                      placeholder="Payment (e.g., $1000/month)"
                    />
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
                      value={offerEdits[o._id]?.description || ""}
                      onChange={(e) =>
                        changeOfferField(o._id, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-gray-900">{o.title}</h4>
                    {o.location && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Location:</span>{o.location}
                      </p>
                    )}
                    {o.type && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Type:</span> {o.type}
                      </p>
                    )}
                    {o.duration && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Duration:</span> {o.duration}
                      </p>
                    )}
                    {o.payment && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Payment:</span>{o.payment}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      {o.description}
                    </p>
                  </>
                )}
                <div className="absolute top-3 right-3 flex gap-3">
                  {editingOffers[o._id] ? (
                    <>
                      <button
                        onClick={() => saveOffer(o._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => toggleEditOffer(o._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleEditOffer(o._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteOfferClick(o._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==== Education ==== */}
        {role === "intern" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
              <h3 className="text-xl font-semibold text-indigo-800 tracking-wide">
                Education
              </h3>
              <button
                onClick={handleAddEducation}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
              >
                + Add
              </button>
            </div>

            <div className="space-y-5">
              {/* New Education Form */}
              {newEducation && (
                <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/30 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                      value={newEducation.diploma}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          diploma: e.target.value,
                        })
                      }
                      placeholder="Diploma / Degree"
                    />
                    <input
                      className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                      value={newEducation.university}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          university: e.target.value,
                        })
                      }
                      placeholder="University / School"
                    />
                    <input
                      className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                      value={newEducation.location}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          location: e.target.value,
                        })
                      }
                      placeholder="Location"
                    />
                    <input
                      className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                      value={newEducation.date}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          date: e.target.value,
                        })
                      }
                      placeholder="Date"
                    />
                  </div>

                  <div className="flex gap-2 mt-4 justify-end">
                    <button
                      onClick={async () => {
                        const updated = [
                          ...(formData.education || []),
                          newEducation,
                        ];
                        await dispatch(
                          updateUser({
                            id: user._id,
                            updates: { education: updated },
                          })
                        );
                        setFormData({ ...formData, education: updated });
                        setNewEducation(null);
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setNewEducation(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Education Entries */}
              {education.map((ed) => (
                <div
                  key={ed._id || Math.random()}
                  className="relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5"
                >
                  {editingEducation[ed._id] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                        value={ed.diploma || ""}
                        onChange={(e) =>
                          changeEducationField(
                            ed._id,
                            "diploma",
                            e.target.value
                          )
                        }
                        placeholder="Diploma"
                      />
                      <input
                        className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                        value={ed.university || ""}
                        onChange={(e) =>
                          changeEducationField(
                            ed._id,
                            "university",
                            e.target.value
                          )
                        }
                        placeholder="University"
                      />
                      <input
                        className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                        value={ed.location || ""}
                        onChange={(e) =>
                          changeEducationField(
                            ed._id,
                            "location",
                            e.target.value
                          )
                        }
                        placeholder="Location"
                      />
                      <input
                        className="w-full border-b border-indigo-300 focus:border-indigo-500 outline-none bg-transparent py-1 text-sm"
                        value={ed.date || ""}
                        onChange={(e) =>
                          changeEducationField(ed._id, "date", e.target.value)
                        }
                        placeholder="Date"
                      />
                    </div>
                  ) : (
                    <div>
                      {/* Diploma & Date */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {ed.diploma}
                        </h4>
                        <span className="text-sm text-indigo-600 font-medium">
                          {ed.date}
                        </span>
                      </div>

                      {/* University (left) & Location (right) */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <p className="text-gray-700 font-medium">
                          {ed.university}
                        </p>
                        <p className="text-gray-500 text-sm md:text-right">
                          {ed.location}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-3">
                    {editingEducation[ed._id] ? (
                      <>
                        <button
                          onClick={() => handleUpdateEducation(ed)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => toggleEditEducation(ed._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleEditEducation(ed._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(ed._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right column - stacks below main on small screens due to flex-col on container */}
      <aside className="w-full lg:w-1/5 bg-indigo-50 p-6 flex flex-col gap-6">
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
          <div className="flex flex-col gap-2">
            {["linkedin", "website", "github"].map(
              (field) =>
                (role === "intern" ||
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
                    {isEditing ? (
                      <input
                        name={field}
                        value={formData[field] || ""}
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
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Add a description"
              rows={4}
              className="w-full border border-indigo-300 rounded-lg p-3 text-sm text-gray-800
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                 transition-all duration-200 bg-white"
            />
          ) : (
            <p className="text-sm text-gray-600 border border-indigo-200 rounded-lg p-3 bg-white min-h-[4rem]">
              {formData.description || "No description provided."}
            </p>
          )}
        </div>

        {role === "intern" && (
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            {isEditing ? (
              <input
                name="skills"
                value={(formData.skills || []).join(", ")}
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
                {(formData.skills || []).map((s, i) => (
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
      </aside>
    </div>
  );
}
