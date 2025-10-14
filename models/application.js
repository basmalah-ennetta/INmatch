const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "offer", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
//insures that each (offer, intern) combo is unique
applicationSchema.index({ offerId: 1, internId: 1 }, { unique: true });

module.exports = mongoose.model("application", applicationSchema);
