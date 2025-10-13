/** @format */
import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg p-4 bg-indigo-50 shadow">
      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}
      <h4 className="font-semibold text-indigo-800">{project.name}</h4>
      <p className="text-sm text-gray-600">{project.description}</p>
      {project.liveDemo && (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 text-sm font-medium hover:underline mt-1 inline-block"
        >
          Live Demo →
        </a>
      )}
    </div>
  );
}
