const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const BusinessUser = require("../models/BusinessUser");
const AssoUser = require("../models/AssoUser");
const mongoose = require("mongoose");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const { request } = require("../app");

router.get("/dashboard", isLoggedIn(), (req, res, next) => {
  res.status(200).json(req.session.currentUser);
});

router.put("/edit", isLoggedIn(), async (req, res, next) => {
  const userId = req.session.currentUser._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const user = await AssoUser.findByIdAndUpdate(userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});

router.get("/search", isLoggedIn(), async (req, res, next) => {
  try {
    const businesses = await BusinessUser.find();
    // console.log(businesses)
    res.status(200).json(businesses);
  } catch (error) {
    res.json(error);
  }
});

router.post("/business/:businessId", isLoggedIn(), async (req, res, next) => {
  const businessId = req.params.businessId;
  const assoId = req.session.currentUser._id;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const business = await BusinessUser.findByIdAndUpdate(businessId, {
      $push: { pendingPartnerships: assoId },
    }).populate("pendingPartnerships");

    const asso = await AssoUser.findByIdAndUpdate(assoId, {
      $push: { pendingPartnerships: businessId },
    }).populate("pendingPartnerships");
    req.session.currentUser = asso;
    res.status(200).json(business, asso);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
