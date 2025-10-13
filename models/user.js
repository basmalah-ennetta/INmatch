const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["entreprise", "admin", "intern"],
    default: "intern",
  },

  // New optional fields for profile
  address: { type: String },
  linkedin: { type: String },
  website: { type: String },
  github: { type: String },
  resume: { type: String },
  description: { type: String },

  // Intern-specific
  education: [
    {
      diploma: String,
      university: String,
      address: String,
      date: String,
    },
  ],
  skills: [{ type: String }],

  // Entreprise-specific
  industry: { type: String },
  websiteEntreprise: { type: String },
});

module.exports = mongoose.model("user", UserSchema);
