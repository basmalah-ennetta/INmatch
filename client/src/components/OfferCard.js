/** @format */
import React from "react";

export default function InternshipOfferCard({ offer }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-indigo-800 mb-1">{offer.title}</h4>
      {offer.location && (
        <p className="text-sm text-gray-700 mb-1">{offer.location}</p>
      )}
      {offer.description && (
        <p className="text-sm text-gray-700">{offer.description}</p>
      )}
    </div>
  );
}
