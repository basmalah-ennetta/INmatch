/** @format */
import { useSelector, useDispatch } from "react-redux";
import {
  updateApplicationStatus,
} from "../redux/applicationSlice";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function CompApp({ ping, setPing }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const allapplications = useSelector(
    (state) => state.application?.applicationList
  );
  const offers = useSelector((state) => state.offer?.offers);
  const userList = useSelector((state) => state.user?.userList);

  const myApplications = allapplications.filter(
    (p) => p.companyId === user._id
  );

  const handleStatusUpdate = async (id, status) => {
    const editedApp = { status };
    await dispatch(updateApplicationStatus({ id, editedApp }));
    setPing(!ping);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-gray-800 flex flex-col">
      <main className="flex-1 p-10 space-y-8 lg:overflow-y-auto lg:max-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b pb-3 text-center">
            Applications Received
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
                    <th className="py-2 px-4">Intern</th>
                    <th className="py-2 px-4">Offer</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myApplications.map((app) => {
                    const offer = offers?.find((o) => o._id === app.offerId);
                    const intern = userList?.find(
                      (u) => u._id === app.internId
                    );

                    return (
                      <tr
                        key={app._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4">
                          {intern ? (
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
                        <td className="py-3 px-4">
                          {offer ? (
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
                        <td className="py-3 px-4">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {app.status === "pending" && (
                            <div className="flex justify-center gap-2">
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
                            </div>
                          )}
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
