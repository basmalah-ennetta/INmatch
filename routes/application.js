const express = require("express");
const Router = express.Router();
const Application = require("../models/application");
const Offer = require("../models/offer");
const User = require("../models/user");

// === CREATE Application ===
Router.post("/", async (req, res) => {
  try {
    const { offerId, companyId, internId } = req.body;

    const newApp = new Application(req.body);
    await newApp.save();
    res.status(200).send({
      msg: "Application created successfully",
      application: newApp,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// === GET all Applications ===
Router.get("/", async (req, res) => {
  try {
    const apps = await Application.find()
    res.status(200).send({ applications: apps, msg: "all Applications" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET Applications by ID ===
Router.get("/:id", async (req, res) => {
  try {
    const apps = await Application.find(req.params.id)
    res.status(200).send({ applications: apps, msg: "Application by id"});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === DELETE Application ===
Router.delete("/:id", async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Application deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = Router;
