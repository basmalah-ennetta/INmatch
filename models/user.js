/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  address: String,
  role: {
    type: String,
    enum: ["intern", "entreprise", "admin"],
    default: "intern",
  },
  projects: [
    {
      title: String,
      image: String,
      description: String,
      liveDemo: String,
    },
  ],
  education: [
    {
      diploma: String,
      university: String,
      location: String,
      date: String,
    },
  ],
  linkedin: String,
  website: String,
  github: String,
  skills: [{ type: String }],
  description: String
});

module.exports = mongoose.model("user", userSchema);
