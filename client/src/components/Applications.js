/** @format */
import { useSelector, useDispatch } from "react-redux";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../redux/applicationSlice";
import { getCurrentUser, getAllUsers } from "../redux/userSlice";
import { getAllOffers } from "../redux/offerSlice";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function Applications({ ping, setPing }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const allapplications = useSelector(
    (state) => state.application?.applicationList
  );
  const offers = useSelector((state) => state.offer?.offers);
  const userList = useSelector((state) => state.user?.userList);

  console.log("apps",allapplications)

  const myApplications =
    user?.role === "intern"
      ? allapplications.filter((p) => p.internId === user._id)
      : allapplications.filter((p) => p.companyId === user._id);

  const handleDelete = async (id) => {
    await dispatch(deleteApplication(id));
    setPing(!ping);
  };

  const handleStatusUpdate = async (id, status) => {
    const editedApp = { status };
    await dispatch(updateApplicationStatus({ id, editedApp }));
    setPing(!ping);
  };
  return (
    <div className="min-h-screen bg-[#f5f7ff] text-gray-800 flex flex-col lg:flex-row">
      <main className="flex-1 p-10 space-y-8 lg:ml-[20%] lg:overflow-y-auto lg:max-h-screen scrollbar-hide">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b pb-3 text-center">
            {user?.role === "intern"
              ? "My Applications"
              : "Applications Received"}
          </h2>

          {myApplications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No applications found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-800">
                    <th className="py-2 px-4">
                      {user?.role === "intern" ? "Offer" : "Intern"}
                    </th>
                    <th className="py-2 px-4">
                      {user?.role === "intern" ? "Company" : "Offer"}
                    </th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myApplications.map((app) => {
                    const offer = offers?.find((o) => o._id === app.offerId);
                    const company = userList?.find(
                      (u) => u._id === app.companyId
                    );
                    const intern = userList?.find(
                      (u) => u._id === app.internId
                    );

                    return (
                      <tr
                        key={app._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* ===== First Column (Offer / Intern) ===== */}
                        <td className="py-3 px-4">
                          {user?.role === "intern" ? (
                            offer ? (
                              <div>
                                <p className="font-medium text-gray-800">
                                  {offer.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {offer.location} • {offer.duration} •{" "}
                                  {offer.type} • {offer.payment}
                                </p>
                              </div>
                            ) : (
                              "—"
                            )
                          ) : intern ? (
                            <div>
                              <p className="font-medium text-gray-800">
                                {intern.name} {intern.lastname}
                              </p>
                              <p className="text-xs text-gray-500">
                                {intern.email} — {intern.phonenumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {intern.address || "No address"}
                              </p>
                              {intern.education?.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  🎓{" "}
                                  {intern.education
                                    .map(
                                      (e) => `${e.diploma} @ ${e.university}`
                                    )
                                    .join(", ")}
                                </p>
                              )}
                              {intern.skills?.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  💡 Skills: {intern.skills.join(", ")}
                                </p>
                              )}
                              {intern.projects?.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  🧩 Projects:{" "}
                                  {intern.projects
                                    .map((p) => p.title)
                                    .join(", ")}
                                </p>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* ===== Second Column (Company / Offer) ===== */}
                        <td className="py-3 px-4">
                          {user?.role === "intern" ? (
                            company ? (
                              <div>
                                <p className="font-medium text-gray-800">
                                  {company.name} {company.lastname}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {company.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {company.address || "No address"}
                                </p>
                              </div>
                            ) : (
                              "—"
                            )
                          ) : offer ? (
                            <div>
                              <p className="font-medium text-gray-800">
                                {offer.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {offer.location} • {offer.duration} •{" "}
                                {offer.type} • {offer.payment}
                              </p>
                              <p className="text-xs text-gray-500">
                                {offer.description?.slice(0, 60)}...
                              </p>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* ===== Status ===== */}
                        <td
                          className={`py-3 px-4 font-medium ${
                            app.status === "accepted"
                              ? "text-green-600"
                              : app.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {app.status}
                        </td>

                        {/* ===== Date ===== */}
                        <td className="py-3 px-4">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>

                        {/* ===== Action Buttons ===== */}
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            {user?.role === "intern" ? (
                              <button
                                onClick={() => handleDelete(app._id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            ) : (
                              <>
                                {app.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(app._id, "accepted")
                                      }
                                      className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <FaCheck /> Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(app._id, "rejected")
                                      }
                                      className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <FaTimes /> Reject
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
