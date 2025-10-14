/** @format */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  updateUser,
  getCurrentUser,
  addEducation,
  addProject,
  addOffer,
  updateEducation,
  updateProject,
  updateOffer,
  deleteEducation,
  deleteProject,
  deleteOffer,
} from "../redux/userSlice";
import {
  FaLinkedin,
  FaGlobe,
  FaGithub,
  FaFileAlt,
  FaTrash,
  FaEdit,
  FaSave,
} from "react-icons/fa";
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

  // local editable arrays + edit-mode trackers
  const [projects, setProjects] = useState([]);
  const [offers, setOffers] = useState([]);
  const [education, setEducation] = useState([]);

  // each map holds ids currently being edited
  const [editingProjects, setEditingProjects] = useState({});
  const [editingOffers, setEditingOffers] = useState({});
  const [editingEducation, setEditingEducation] = useState({});

  useEffect(() => {
    // Fetch current user (and populate local arrays)
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/user/current", {
          headers: { Authorization: token },
        });
        const u = res.data.user;
        setFormData((prev) => ({ ...prev, ...u }));
        setProjects(u.projects || []);
        setOffers(u.offers || []);
        setEducation(u.education || []);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // keep formData in sync if the global user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }));
      setProjects(user.projects || []);
      setOffers(user.offers || []);
      setEducation(user.education || []);
    }
  }, [user]);

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
        // refresh local arrays from returned user if present
        if (resultAction.payload?.projects)
          setProjects(resultAction.payload.projects);
        if (resultAction.payload?.offers)
          setOffers(resultAction.payload.offers);
        if (resultAction.payload?.education)
          setEducation(resultAction.payload.education);
      } else {
        alert("Failed to save changes.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ===== ADD =====
  const handleAddProject = async () => {
    const newProject = { title: "", image: "", description: "", liveDemo: "" };
    const res = await dispatch(
      addProject({ id: user._id, project: newProject })
    );
    if (addProject.fulfilled.match(res)) {
      // update local projects array from payload.user if present
      const updatedUser = res.payload;
      if (updatedUser?.projects) {
        setProjects(updatedUser.projects);
      } else {
        // fallback: push the returned project (if API returns it)
        setProjects((prev) => [...prev, { ...newProject }]);
      }
    }
  };

  const handleAddOffer = async () => {
    const newOffer = {
      title: "",
      company: "",
      location: "",
      tags: {},
      payment: "",
      description: "",
    };
    const res = await dispatch(addOffer({ id: user._id, offer: newOffer }));
    if (addOffer.fulfilled.match(res)) {
      const updatedUser = res.payload;
      if (updatedUser?.offers) setOffers(updatedUser.offers);
      else setOffers((prev) => [...prev, { ...newOffer }]);
    }
  };

  const handleAddEducation = async () => {
    const newEdu = { diploma: "", university: "", location: "", date: "" };
    const res = await dispatch(
      addEducation({ id: user._id, education: newEdu })
    );
    if (addEducation.fulfilled.match(res)) {
      const updatedUser = res.payload;
      if (updatedUser?.education) setEducation(updatedUser.education);
      else setEducation((prev) => [...prev, { ...newEdu }]);
    }
  };

  // ===== EDIT MODE HELPERS (toggle / change local arrays) =====
  const toggleEditProject = (id) => {
    setEditingProjects((s) => ({ ...s, [id]: !s[id] }));
  };
  const toggleEditOffer = (id) => {
    setEditingOffers((s) => ({ ...s, [id]: !s[id] }));
  };
  const toggleEditEducation = (id) => {
    setEditingEducation((s) => ({ ...s, [id]: !s[id] }));
  };

  const changeProjectField = (id, field, value) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  };
  const changeOfferField = (id, field, value) => {
    setOffers((prev) =>
      prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
    );
  };
  const changeEducationField = (id, field, value) => {
    setEducation((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  // ===== UPDATE (save a single item) =====
  const handleUpdateProject = async (proj) => {
    const res = await dispatch(
      updateProject({ id: user._id, projId: proj._id, updates: proj })
    );
    if (updateProject.fulfilled.match(res)) {
      // use payload user if provided to refresh
      if (res.payload?.projects) setProjects(res.payload.projects);
      toggleEditProject(proj._id);
    } else {
      alert("Failed to update project");
    }
  };

  const handleUpdateOffer = async (offer) => {
    const res = await dispatch(
      updateOffer({ id: user._id, offerId: offer._id, updates: offer })
    );
    if (updateOffer.fulfilled.match(res)) {
      if (res.payload?.offers) setOffers(res.payload.offers);
      toggleEditOffer(offer._id);
    } else {
      alert("Failed to update offer");
    }
  };

  const handleUpdateEducation = async (edu) => {
    const res = await dispatch(
      updateEducation({ id: user._id, eduId: edu._id, updates: edu })
    );
    if (updateEducation.fulfilled.match(res)) {
      if (res.payload?.education) setEducation(res.payload.education);
      toggleEditEducation(edu._id);
    } else {
      alert("Failed to update education");
    }
  };

  // ===== DELETE =====
  const handleDeleteProject = async (projId) => {
    const res = await dispatch(deleteProject({ id: user._id, projId }));
    if (deleteProject.fulfilled.match(res)) {
      if (res.payload?.projects) {
        setProjects(res.payload.projects);
      } else {
        setProjects((prev) => prev.filter((p) => p._id !== projId));
      }
    } else {
      alert("Failed to delete project");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    const res = await dispatch(deleteOffer({ id: user._id, offerId }));
    if (deleteOffer.fulfilled.match(res)) {
      if (res.payload?.offers) setOffers(res.payload.offers);
      else setOffers((prev) => prev.filter((o) => o._id !== offerId));
    } else {
      alert("Failed to delete offer");
    }
  };

  const handleDeleteEducation = async (eduId) => {
    const res = await dispatch(deleteEducation({ id: user._id, eduId }));
    if (deleteEducation.fulfilled.match(res)) {
      if (res.payload?.education) setEducation(res.payload.education);
      else setEducation((prev) => prev.filter((e) => e._id !== eduId));
    } else {
      alert("Failed to delete education");
    }
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
          <button
            onClick={() => (window.location.href = "/applications")}
            className="hover:bg-indigo-700 p-2 rounded-lg text-left"
          >
            {user?.role === "intern"
              ? "My Applications"
              : "Applications Received"}
          </button>
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
              ? projects.map((p) => (
                  <div
                    key={p._id || Math.random()}
                    className="relative border rounded-lg p-3 bg-white"
                  >
                    {/* Inline editable fields: title + description + liveDemo */}
                    <div className="mb-2">
                      {editingProjects[p._id] ? (
                        <input
                          className="w-full border-b outline-none mb-2"
                          value={p.title || p.name || ""}
                          onChange={(e) =>
                            changeProjectField(p._id, "title", e.target.value)
                          }
                          placeholder="Project title"
                        />
                      ) : (
                        <h4 className="font-semibold">{p.title || p.name}</h4>
                      )}
                      {editingProjects[p._id] ? (
                        <textarea
                          className="w-full rounded p-2"
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
                      ) : (
                        <p className="text-sm text-gray-700">{p.description}</p>
                      )}
                      {editingProjects[p._id] ? (
                        <input
                          className="w-full border-b outline-none mt-2"
                          value={p.liveDemo || ""}
                          onChange={(e) =>
                            changeProjectField(
                              p._id,
                              "liveDemo",
                              e.target.value
                            )
                          }
                          placeholder="Live demo URL"
                        />
                      ) : (
                        p.liveDemo && (
                          <a
                            href={p.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-indigo-600 hover:underline"
                          >
                            Live demo
                          </a>
                        )
                      )}
                    </div>

                    {/* Original ProjectCard for styling consistency (non-edit view) */}
                    {!editingProjects[p._id] && <ProjectCard project={p} />}

                    <div className="absolute top-2 right-2 flex gap-2">
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
                ))
              : offers.map((o) => (
                  <div
                    key={o._id || Math.random()}
                    className="relative border rounded-lg p-3 bg-white"
                  >
                    <div className="mb-2">
                      {editingOffers[o._id] ? (
                        <input
                          className="w-full border-b outline-none mb-2"
                          value={o.title || ""}
                          onChange={(e) =>
                            changeOfferField(o._id, "title", e.target.value)
                          }
                          placeholder="Offer title"
                        />
                      ) : (
                        <h4 className="font-semibold">{o.title}</h4>
                      )}

                      {editingOffers[o._id] ? (
                        <input
                          className="w-full border-b outline-none mb-2"
                          value={o.location || ""}
                          onChange={(e) =>
                            changeOfferField(o._id, "location", e.target.value)
                          }
                          placeholder="Location"
                        />
                      ) : (
                        o.location && (
                          <p className="text-sm text-gray-700">{o.location}</p>
                        )
                      )}

                      {editingOffers[o._id] ? (
                        <textarea
                          className="w-full rounded p-2"
                          value={o.description || ""}
                          onChange={(e) =>
                            changeOfferField(
                              o._id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description"
                        />
                      ) : (
                        <p className="text-sm text-gray-700">{o.description}</p>
                      )}
                    </div>

                    {!editingOffers[o._id] && <InternshipOfferCard offer={o} />}

                    <div className="absolute top-2 right-2 flex gap-2">
                      {editingOffers[o._id] ? (
                        <>
                          <button
                            onClick={() => handleUpdateOffer(o)}
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
                            onClick={() => handleDeleteOffer(o._id)}
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
              {education.map((ed) => (
                <div
                  key={ed._id || Math.random()}
                  className="border border-gray-200 p-3 rounded-lg text-sm relative bg-white"
                >
                  <div>
                    {editingEducation[ed._id] ? (
                      <>
                        <input
                          className="w-full border-b mb-2 outline-none"
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
                          className="w-full border-b mb-2 outline-none"
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
                          className="w-full border-b mb-2 outline-none"
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
                          className="w-full border-b mb-2 outline-none"
                          value={ed.date || ""}
                          onChange={(e) =>
                            changeEducationField(ed._id, "date", e.target.value)
                          }
                          placeholder="Date"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{ed.diploma}</p>
                        <p>{ed.university}</p>
                        <p>{ed.location}</p>
                        <p>{ed.date}</p>
                      </>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 flex gap-2">
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
                          className="text-gray-600 hover:text-gray-800"
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
      </div>

      {/* ==== Right Section ==== */}
      <div className="w-1/5 bg-indigo-50 p-6 flex flex-col gap-6">
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
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
      </div>
    </div>
  );
}
