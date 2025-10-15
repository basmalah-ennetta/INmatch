/** @format */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOffers } from "../redux/offerSlice";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaTimesCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Offers = () => {
  const dispatch = useDispatch();
  const { offers = [], status } = useSelector((state) => state.offer);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    payment: "",
    type: "",
    duration: "",
    sort: "newest",
  });

  useEffect(() => {
    dispatch(getAllOffers());
  }, [dispatch]);

  const handleFilterChange = (e) =>
    setFilters((s) => ({ ...s, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({
      search: "",
      location: "",
      payment: "",
      type: "",
      duration: "",
      sort: "newest",
    });

  const derivePaymentKind = (payment) => {
    const raw = (payment || "").toString().trim().toLowerCase();
    if (raw === "" || raw === "unpaid" || /(^unpaid\b)|\bno pay\b/.test(raw))
      return "unpaid";
    if (/\d/.test(raw) || /[£$€¢₹]/.test(raw) || raw.includes("paid"))
      return "paid";
    return "paid";
  };

  const deriveWorkType = (offer) => {
    if (offer.type && offer.type.trim() !== "") return offer.type.toLowerCase();
    if (offer.location && offer.location.trim() !== "") return "in-office";
    return "remote";
  };

  const deriveDurationKey = (duration) => {
    const raw = (duration || "").toString().trim().toLowerCase();
    if (raw === "") return "undisclosed";
    if (/(^3\b)|\b3\s*month|\b3-month/.test(raw)) return "3";
    if (/(^6\b)|\b6\s*month|\b6-month/.test(raw)) return "6";
    if (/(year|yr|12\s*months|1\s*year)/.test(raw)) return "year";
    if (/(undisclosed|not specified|n\/a|tbd|to be determined|—|-)/.test(raw))
      return "undisclosed";

    const digits = raw.match(/\d+/);
    if (digits) {
      const n = parseInt(digits[0], 10);
      if (n >= 12) return "year";
      if (n >= 6) return "6";
      if (n >= 3) return "3";
    }
    return "undisclosed";
  };

  const timeSincePosted = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted yesterday";
    return `Posted ${diffDays} days ago`;
  };

  const filteredOffers = (offers || [])
    .filter((offer) => {
      const title = (offer.title || "").toLowerCase();
      const description = (offer.description || "").toLowerCase();
      const offerLocation = (offer.location || "").toLowerCase();
      const paymentKind = derivePaymentKind(offer.payment);
      const workType = deriveWorkType(offer);
      const durationKey = deriveDurationKey(offer.duration);
      const searchTerm = filters.search.toLowerCase();

      const matchSearch =
        filters.search === "" ||
        title.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchLocation =
        filters.location === "" ||
        offerLocation.includes(filters.location.toLowerCase());

      const matchPayment =
        filters.payment === "" || paymentKind === filters.payment.toLowerCase();

      const matchType =
        filters.type === "" || workType === filters.type.toLowerCase();

      const matchDuration =
        filters.duration === "" ||
        durationKey === filters.duration.toLowerCase();

      return (
        matchSearch &&
        matchLocation &&
        matchPayment &&
        matchType &&
        matchDuration
      );
    })
    .sort((a, b) => {
      if (filters.sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Opportunities
          </h2>
          <div className="relative mb-4">
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="flex items-center gap-2 bg-indigo-500 text-white px-2 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              <FaFilter />
              {showFilters ? "Hide" : "Filter"}
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 text-sm text-gray-500 whitespace-nowrap">
              {filteredOffers.length} offers
            </div>
          </div>
        </div>

        {/* Toggleable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 shadow-sm"
            >
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[180px]">
                  <FaSearch className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>

                <input
                  type="text"
                  name="location"
                  placeholder="Location..."
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <select
                  name="payment"
                  value={filters.payment}
                  onChange={handleFilterChange}
                  className="flex-1 min-w-[130px] border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>

                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="flex-1 min-w-[130px] border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">All Work Types</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="in-office">In-office</option>
                </select>

                <select
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="flex-1 min-w-[140px] border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">All Durations</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="year">1 year</option>
                  <option value="undisclosed">Undisclosed</option>
                </select>

                <div className="relative flex-1 min-w-[140px]">
                  <FaSortAmountDown className="absolute top-3 left-3 text-gray-400" />
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition px-4 py-2 rounded-lg text-sm"
                >
                  <FaTimesCircle />
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OFFERS LIST */}
        {status === "pending" ? (
          <p className="text-gray-500 text-center mt-8">Loading offers...</p>
        ) : filteredOffers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredOffers.map((offer) => {
              const paymentKind = derivePaymentKind(offer.payment);
              const workType = deriveWorkType(offer);

              return (
                <div
                  key={offer._id}
                  className="relative border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 bg-white"
                >
                  {/* TYPE BADGE TOP-RIGHT */}
                  <span
                    className={`absolute top-3 right-3 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                      ${
                        workType === "remote"
                          ? "bg-blue-100 text-blue-800"
                          : workType === "hybrid"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                  >
                    {workType.toUpperCase()}
                  </span>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {offer.title}
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {offer.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-indigo-500" />
                      {offer.location || "—"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMoneyBillWave
                        className={
                          paymentKind === "paid"
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      />
                      {paymentKind === "paid"
                        ? offer.payment || "Paid"
                        : "Unpaid"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />{" "}
                      {offer.duration || "Undisclosed duration"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />{" "}
                      {timeSincePosted(offer.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">No offers found.</p>
        )}
      </div>
    </div>
  );
};

export default Offers;
