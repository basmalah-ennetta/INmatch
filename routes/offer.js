const express = require("express");
const Router = express.Router();
const Offer = require("../models/offer");
const User = require("../models/user");
const Application = require("../models/application");

// === CREATE Offer ===
Router.post("/", async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    await newOffer.save();
    res.status(200).send({ msg: "Offer created successfully", offer: newOffer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET All Offers ===
Router.get("/", async (req, res) => {
  try {
    let result = await Offer.find();
    res.send({ offers: result, msg: "all Offers" });
  } catch (error) {
    console.log(error);
  }
});

// === GET Offer by ID ===
Router.get("/:id", async (req, res) => {
  try {
    let result = await Offer.findById(req.params.id);
    res.send({ offer: result, msg: "offer is found" });
  } catch (error) {
    console.log(error);
  }
});

// === UPDATE Offer ===
Router.put("/:id", async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).send({ msg: "Offer updated", offer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === DELETE Offer ===
Router.delete("/:id", async (req, res) => {
  try {
    let result = await Offer.findByIdAndDelete(req.params.id);
    res.send({ msg: "offer is deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
