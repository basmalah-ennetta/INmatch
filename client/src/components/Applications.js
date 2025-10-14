/** @format */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserApplications, deleteApplication } from "../redux/applicationSlice";

export default function Applications() {
  const dispatch = useDispatch();
  const { applications, isLoading, error } = useSelector((state) => state.application);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserApplications());
  }, [dispatch]);

  if (isLoading) return <div className="text-center mt-10">Loading applications...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-10">
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">
        {user?.role === "intern" ? "My Applications" : "Applications Received"}
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 relative"
            >
              {user?.role === "intern" ? (
                <>
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {app.offer?.title}
                  </h3>
                  <p className="text-gray-600">{app.offer?.company}</p>
                  <p className="text-sm mt-2">{app.offer?.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Applicant: {app.applicant?.name} {app.applicant?.lastname}
                  </h3>
                  <p className="text-gray-600">{app.applicant?.email}</p>
                  <p className="text-sm mt-2">
                    Offer: <span className="font-medium">{app.offer?.title}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Received on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}

              {user?.role === "intern" && (
                <button
                  onClick={() => dispatch(deleteApplication(app._id))}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
