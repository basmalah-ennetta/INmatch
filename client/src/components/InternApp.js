/** @format */
import { useSelector, useDispatch } from "react-redux";
import {
  deleteApplication,
} from "../redux/applicationSlice";
import { FaTrash } from "react-icons/fa";

export default function InternApp({ ping, setPing }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const allapplications = useSelector(
    (state) => state.application?.applicationList
  );
  const offers = useSelector((state) => state.offer?.offers);
  const userList = useSelector((state) => state.user?.userList);

  const myApplications = allapplications.filter(
    (p) => p.internId === user._id
  );

  const handleDelete = async (id) => {
    await dispatch(deleteApplication(id));
    setPing(!ping);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-gray-800 flex flex-col">
      <main className="flex-1 p-10 space-y-8 lg:overflow-y-auto lg:max-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b pb-3 text-center">
            My Applications
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
                    <th className="py-2 px-4">Offer</th>
                    <th className="py-2 px-4">Company</th>
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

                    return (
                      <tr
                        key={app._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
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
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {company ? (
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
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
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
