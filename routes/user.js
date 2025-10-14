/** @format */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Router = express.Router();
const User = require("../models/user");
const isAuth = require("../middleware/passport");
const {
  signupRules,
  loginRules,
  validation,
} = require("../middleware/validator");

//signup
Router.post("/signup", signupRules(), validation, async (req, res) => {
  const { name, lastname, email, password, phonenumber } = req.body;
  try {
    const NewUser = new User(req.body);
    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .send({ msg: "user already exists with this email" });
    }

    //hash password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashPwd = await bcrypt.hash(password, genSalt);
    NewUser.password = hashPwd;

    //generate token
    const newUserToken = await NewUser.save();
    const payload = { _id: newUserToken._id, name: newUserToken.name };
    const token = await jwt.sign(payload, process.env.SECRET_KEY);

    //save user
    res
      .status(200)
      .send({
        newUserToken,
        token: `Bearer ${token}`,
        msg: "user saved successfully",
      });
  } catch (error) {
    res.status(400).send({ error, msg: "error in signup" });
  }
});

//login
Router.post("/login", loginRules(), validation, async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).send({ msg: "user does not exist" });
    }
    //check password
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "incorrect password" });
    }

    //generate token
    const payload = { _id: userExists._id };
    const token = await jwt.sign(payload, process.env.SECRET_KEY);

    //get user
    res.status(200).send({
      userExists,
      msg: "user logged in successfully",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).send({ error, msg: "error in login" });
  }
});

//get current user
Router.get("/current", isAuth(), (req, res) => {
  res.status(200).send({ user: req.user });
});

// get all users
Router.get("/", async (req, res) => {
  try {
    let result = await User.find();
    res.send({ users: result, msg: "all Users" });
  } catch (error) {
    console.log(error);
  }
});

//delete user
Router.delete("/:id", async (req, res) => {
  try {
    let result = await User.findByIdAndDelete(req.params.id);
    res.send({ msg: "user is deleted" });
  } catch (error) {
    console.log(error);
  }
});

// update profile
Router.put("/:id", async (req, res) => {
  try {
    const { password, ...updates } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.status(200).send({ msg: "User is updated", user: updatedUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add Education
Router.post("/:id/education", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ msg: "User not found" });

    user.education.push(req.body);
    await user.save();
    res.status(200).send({ msg: "Education added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add Project (Intern)
Router.post("/:id/project", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ msg: "User not found" });

    user.projects.push(req.body);
    await user.save();
    res.status(200).send({ msg: "Project added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add Offer (Entreprise)
Router.post("/:id/offer", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ msg: "User not found" });

    user.offers.push(req.body);
    await user.save();
    res.status(200).send({ msg: "Offer added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// ==== PROJECT ROUTES ====
Router.post("/:id/projects", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.projects.push(req.body);
    await user.save();
    res.send({ msg: "Project added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.put("/:id/projects/:projId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const project = user.projects.id(req.params.projId);
    Object.assign(project, req.body);
    await user.save();
    res.send({ msg: "Project updated", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.delete("/:id/projects/:projId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.projects.id(req.params.projId).remove();
    await user.save();
    res.send({ msg: "Project deleted", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// ==== OFFER ROUTES ====
Router.post("/:id/offers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.offers.push(req.body);
    await user.save();
    res.send({ msg: "Offer added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.put("/:id/offers/:offerId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const offer = user.offers.id(req.params.offerId);
    Object.assign(offer, req.body);
    await user.save();
    res.send({ msg: "Offer updated", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.delete("/:id/offers/:offerId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.offers.id(req.params.offerId).remove();
    await user.save();
    res.send({ msg: "Offer deleted", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// ==== EDUCATION ROUTES ====
Router.post("/:id/education", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.education.push(req.body);
    await user.save();
    res.send({ msg: "Education added", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.put("/:id/education/:eduId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const edu = user.education.id(req.params.eduId);
    Object.assign(edu, req.body);
    await user.save();
    res.send({ msg: "Education updated", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Router.delete("/:id/education/:eduId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.education.id(req.params.eduId).remove();
    await user.save();
    res.send({ msg: "Education deleted", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = Router;
