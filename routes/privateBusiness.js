const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const BusinessUser = require("../models/BusinessUser");
const AssoUser = require("../models/AssoUser");
const Product = require("../models/Product");
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
    const user = await BusinessUser.findByIdAndUpdate(userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});

router.post("/products/new", isLoggedIn(), async (req, res, next) => {
  const { name, typeName, isAvailable, quantity } = req.body;

  const user = req.session.currentUser;

  try {
    const newProduct = await Product.create({
      name,
      productType: { name: typeName },
      today: { isAvailable, quantity },
      owner: user._id,
    });

    const newBusinessUser = await BusinessUser.findByIdAndUpdate(user._id, {
      $push: { products: newProduct._id },
    });

    req.session.currentUser = newBusinessUser;
    res.json(newProduct);
  } catch (error) {
    res.json(error);
  }
});

router.put("/products/edit/:id", isLoggedIn(), async (req, res, next) => {
  const { name, typeName, isAvailable, quantity } = req.body;

  try {
    const newProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      productType: { name: typeName },
      today: { isAvailable, quantity },
    });

    res.json(newProduct);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/products/:id", isLoggedIn(), async (req, res, next) => {
  const productId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const newProduct = await Product.findByIdAndDelete(productId);
    res
      .status(200)
      .json({ message: `Product with ${productId} is removed successfully.` });
  } catch (error) {
    res.json(error);
  }
});

router.get("/association/:assoId", isLoggedIn(), async (req, res, next) => {
  const assoId = req.params.assoId;
  if (!mongoose.Types.ObjectId.isValid(assoId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const asso = await AssoUser.findById(assoId);
    res.status(200).json(asso);
  } catch (error) {
    res.json(error);
  }
});

router.post("/association/accept/:assoId", isLoggedIn(), async (req, res, next) => {
  const assoId = req.params.assoId;
  const businessId = req.session.currentUser._id;
  if (!mongoose.Types.ObjectId.isValid(assoId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const asso = await AssoUser.findByIdAndUpdate(assoId, {
      $push: { partnerships: businessId },
      $pull: { pendingPartnerships: businessId },
    });
    const business = await BusinessUser.findByIdAndUpdate(businessId, {
      $push: { partnerships: assoId },
      $pull: { pendingPartnerships: assoId },
    });
    req.session.currentUser = business;
    res.status(200).json({ message: `Collaboration accepted by ${req.session.currentUser.name}`});
  } catch (error) {
    res.json(error);
  }
});

router.post("/association/reject/:assoId", isLoggedIn(), async (req, res, next) => {
    const assoId = req.params.assoId;
    const businessId = req.session.currentUser._id;
    if (!mongoose.Types.ObjectId.isValid(assoId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    try {
      const asso = await AssoUser.findByIdAndUpdate(assoId, {
        $pull: { pendingPartnerships: businessId },
      });
      const business = await BusinessUser.findByIdAndUpdate(businessId, {
        $pull: { pendingPartnerships: assoId },
      });
      req.session.currentUser = business;
      res.status(200).json({ message: `Collaboration rejected by ${req.session.currentUser.name}`});
    } catch (error) {
      res.json(error);
    }
  });

module.exports = router;
