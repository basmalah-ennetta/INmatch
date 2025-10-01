const mongoose = require("mongoose");
const schema= mongoose.Schema;

const UserSchema = new schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["entreprise", "admin", "intern"],
        default: "intern"
    },

    //entreprise
    industry: { type: String },   
    website: { type: String }, 

    //interns
    education: { type: String }, 
    skills: [{ type: String }], 
    // resume: { type: String },
});

const User = mongoose.model("user", UserSchema);
module.exports= User;