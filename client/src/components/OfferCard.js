/** @format */
import React from "react";

export default function InternshipOfferCard({ offer }) {
  return (
    <div className="border rounded-lg p-4 bg-indigo-50 shadow">
      <h4 className="font-semibold text-indigo-800">{offer.title}</h4>
      <p className="text-sm text-gray-600">{offer.company}</p>
      <p className="text-xs text-gray-500">{offer.location}</p>
      <p className="mt-2 text-sm">{offer.description}</p>
    </div>
  );
}
