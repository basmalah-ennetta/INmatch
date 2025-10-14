const mongoose = require("mongoose");
const { Schema } = mongoose;

const offerSchema = new Schema({
  title: { type: String, required: true },
  location: String,
  duration: String,
  type: { type: String, enum: ["remote", "hybrid", "in-office"] },
  payment: String,
  description: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("offer", offerSchema);
