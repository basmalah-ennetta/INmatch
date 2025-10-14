const express = require("express");
const Router = express.Router();
const Application = require("../models/application");
const Offer = require("../models/offer");
const User = require("../models/user");

// === CREATE Application ===
Router.post("/", async (req, res) => {
  try {
    const { offerId, companyId, internId } = req.body;

    // Validate IDs
    const offer = await Offer.findById(offerId);
    const company = await User.findById(companyId);
    const intern = await User.findById(internId);

    if (!offer || !company || !intern) {
      return res.status(404).send({ msg: "Invalid offer, company, or intern ID" });
    }

    // 🧠 Prevent duplicate application
    const existingApp = await Application.findOne({ offerId, internId });
    if (existingApp) {
      return res
        .status(400)
        .send({ msg: "You have already applied for this offer." });
    }

    // ✅ Create application
    const newApp = new Application({ offerId, companyId, internId });
    await newApp.save();

    // Link application to offer
    offer.applications.push(newApp._id);
    await offer.save();

    // Optional: link offer to intern
    if (intern.appliedOffers && !intern.appliedOffers.includes(offerId)) {
      intern.appliedOffers.push(offerId);
      await intern.save();
    }

    res.status(200).send({
      msg: "Application created successfully",
      application: newApp,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// === GET Applications ===
Router.get("/", async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("internId", "name lastname email education description")
      .populate("companyId", "name lastname email")
      .populate("offerId", "title location duration type");

    res.status(200).send({ applications: apps });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET Applications by Offer ===
Router.get("/offer/:offerId", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId).populate({
      path: "applications",
      populate: { path: "internId", select: "name lastname email" },
    });
    if (!offer) return res.status(404).send({ msg: "Offer not found" });

    res.status(200).send({
      offerTitle: offer.title,
      applications: offer.applications,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === GET Applications by Intern ===
Router.get("/intern/:internId", async (req, res) => {
  try {
    const apps = await Application.find({ internId: req.params.internId })
      .populate("offerId", "title location duration type")
      .populate("companyId", "name email");

    res.status(200).send({ applications: apps });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// === DELETE Application ===
Router.delete("/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).send({ msg: "Application not found" });
    }

    // Remove application ID from the related offer
    await Offer.findByIdAndUpdate(app.offerId, {
      $pull: { applications: app._id },
    });

    // Optional: Remove offer ID from intern's appliedOffers
    await User.findByIdAndUpdate(app.internId, {
      $pull: { appliedOffers: app.offerId },
    });

    // Finally, delete the application itself
    await Application.findByIdAndDelete(req.params.id);

    res.status(200).send({ msg: "Application deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = Router;
