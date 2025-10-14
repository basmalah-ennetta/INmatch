const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "offer", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("application", applicationSchema);
