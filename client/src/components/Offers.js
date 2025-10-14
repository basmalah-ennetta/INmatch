import { useEffect, useState } from "react";
import axios from "axios";

// Reusable Confirmation Modal
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-gray-800">{message}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyDashboard({ companyId }) {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteOfferModal, setShowDeleteOfferModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const [showDeleteAppModal, setShowDeleteAppModal] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  // Fetch all offers for the company
  useEffect(() => {
    fetchOffers();
  }, [companyId]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`/offer?companyId=${companyId}`);
      setOffers(res.data.offers);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch offer details including applicants
  const openOfferDetails = async (offerId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/offer/${offerId}/details${filterStatus ? `?status=${filterStatus}` : ""}`
      );
      setSelectedOffer(res.data.offer);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Update application status
  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.put(`/application/${appId}`, { status });
      openOfferDetails(selectedOffer._id);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete offer
  const deleteOffer = async (offerId) => {
    try {
      await axios.delete(`/offer/${offerId}`);
      setSelectedOffer(null);
      setOfferToDelete(null);
      setShowDeleteOfferModal(false);
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete application
  const deleteApplication = async (appId) => {
    try {
      await axios.delete(`/application/${appId}`);
      setAppToDelete(null);
      setShowDeleteAppModal(false);
      openOfferDetails(selectedOffer._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Offers</h1>

      {/* Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => openOfferDetails(offer._id)}
          >
            <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
            <p className="text-gray-600">Location: {offer.location}</p>
            <p className="text-gray-600">Type: {offer.type}</p>
            <p className="text-gray-600">
              Applicants: {offer.applications?.length || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-6 overflow-auto z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-red-500 font-bold text-lg"
              onClick={() => setSelectedOffer(null)}
            >
              ✕
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedOffer.title}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => {
                  setOfferToDelete(selectedOffer._id);
                  setShowDeleteOfferModal(true);
                }}
              >
                Delete Offer
              </button>
            </div>

            <p className="mb-2">{selectedOffer.description}</p>
            <p className="mb-2">
              Company: {selectedOffer.companyId.name} {selectedOffer.companyId.lastname}
            </p>
            <p className="mb-4">Location: {selectedOffer.location}</p>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold">Filter Applicants:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => openOfferDetails(selectedOffer._id)}
              >
                Apply
              </button>
            </div>

            {/* Applicants */}
            <h3 className="text-xl font-semibold mb-2">Applicants</h3>
            {loading ? (
              <p>Loading applicants...</p>
            ) : selectedOffer.applications.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <ul className="space-y-3">
                {selectedOffer.applications.map((app) => (
                  <li
                    key={app._id}
                    className="border p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {app.internId.name} {app.internId.lastname}
                      </p>
                      <p className="text-gray-600">{app.internId.email}</p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={`font-bold ${
                            app.status === "accepted"
                              ? "text-green-600"
                              : app.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                            onClick={() => updateApplicationStatus(app._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            onClick={() => {
                              setAppToDelete(app._id);
                              setShowDeleteAppModal(true);
                            }}
                          >
                            Reject / Delete
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Delete Offer Confirmation Modal */}
      {showDeleteOfferModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this offer and all related applications?"
          onConfirm={() => deleteOffer(offerToDelete)}
          onCancel={() => setShowDeleteOfferModal(false)}
        />
      )}

      {/* Delete Application Confirmation Modal */}
      {showDeleteAppModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this application?"
          onConfirm={() => deleteApplication(appToDelete)}
          onCancel={() => setShowDeleteAppModal(false)}
        />
      )}
    </div>
  );
}

export default CompanyDashboard;
