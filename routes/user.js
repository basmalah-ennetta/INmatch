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
      .send({ newUserToken, token, msg: "user saved successfully" });
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
    res
      .status(200)
      .send({
        userExists,
        msg: "user logged in successfully",
        token: `Bearer ${token}`,
      });
  } catch (error) {
    res.status(400).send({ error, msg: "error in login" });
  }
});

//get current user
userRouter.get("/current", isAuth(), (req, res) => {
  res.status(200).send({ user: req.user });
});

// get all users
userRouter.get("/", async (req, res) => {
  try {
    let result = await User.find();
    res.send({ users: result, msg: "all Users" });
  } catch (error) {
    console.log(error);
  }
});

//delete user
userRouter.delete("/:id", async (req, res) => {
  try {
    let result = await User.findByIdAndDelete(req.params.id);
    res.send({ msg: "user is deleted" });
  } catch (error) {
    console.log(error);
  }
});

// update profil
userRouter.put("/:id", async (req, res) => {
  try {
    const { password, ...otherUpdates } = req.body;

    // Hash password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      otherUpdates.password = await bcrypt.hash(password, salt);
    }

    let result = await User.findByIdAndUpdate(
      req.params.id,
      { $set: otherUpdates },
      { new: true }
    );

    if (!result) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.send({ msg: "User is updated", user: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = Router;
