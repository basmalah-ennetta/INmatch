const express = require("express");
const Router = express.Router();
const Offer = require("../models/offer");
const User = require("../models/user");
const Application = require("../models/application");

// === CREATE Offer ===
Router.post("/", async (req, res) => {
  try {
    const { companyId } = req.body;
    const company = await User.findById(companyId);
    if (!company) return res.status(404).send({ msg: "Company not found" });

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
    const offers = await Offer.find().populate("companyId", "name lastname email");
    res.status(200).send({ offers });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET Offer by ID ===
Router.get("/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("companyId", "name email");
    if (!offer) return res.status(404).send({ msg: "Offer not found" });
    res.status(200).send({ offer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET Offer Details (filter by status) ===
Router.get("/:id/details", async (req, res) => {
  try {
    const { status } = req.query; // optional ?status=pending
    const offer = await Offer.findById(req.params.id)
      .populate("companyId", "name lastname email description")
      .populate({
        path: "applications",
        match: status ? { status } : {}, // filters applications by status
        populate: {
          path: "internId",
          select: "name lastname email education skills description",
        },
      });

    if (!offer) {
      return res.status(404).send({ msg: "Offer not found" });
    }

    res.status(200).send({
      msg: "Offer details fetched successfully",
      offer,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//for rntreprise dashboard: get summary of offer with number of applications and status
Router.get("/:id/summary", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("applications", "status");
    if (!offer) return res.status(404).send({ msg: "Offer not found" });

    const summary = offer.applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0 }
    );

    res.status(200).send({ offerId: offer._id, title: offer.title, summary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// === UPDATE Offer ===
Router.put("/:id", async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!offer) return res.status(404).send({ msg: "Offer not found" });
    res.status(200).send({ msg: "Offer updated", offer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === DELETE Offer ===
Router.delete("/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).send({ msg: "Offer not found" });

    // Delete all related applications
    const apps = await Application.find({ offerId: offer._id });
    for (const app of apps) {
      // Remove offer from intern's appliedOffers
      await User.findByIdAndUpdate(app.internId, {
        $pull: { appliedOffers: offer._id },
      });
      // Delete the application
      await Application.findByIdAndDelete(app._id);
    }

    // Delete the offer itself
    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).send({ msg: "Offer and related applications deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = Router;
