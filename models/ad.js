const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropositionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true }, 
  duration: { type: String, required: true }, 
  techStack: [{ type: String }],              
  location: { type: String, required: true }, 
  payment: { type: String, enum: ["Paid", "Unpaid", "Stipend"], required: true },
  
  // Relations
  entreprise: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Proposition", PropositionSchema);
