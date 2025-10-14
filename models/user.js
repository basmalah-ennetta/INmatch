const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: String,
  image: String,
  description: String,
  liveDemo: String,
});

const educationSchema = new Schema({
  diploma: String,
  university: String,
  location: String,
  date: String,
});

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  role: { type: String, enum: ["intern", "entreprise", "admin"], default: "intern" },
  projects: [projectSchema],
  education: [educationSchema],
  skills: [{ type: String }],
  description: String,
  appliedOffers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offer" }],
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offer" }],
});

module.exports = mongoose.model("user", userSchema);
