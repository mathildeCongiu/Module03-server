const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const BusinessUser = require("../models/BusinessUser");
const AssoUser = require("../models/AssoUser");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");


router.delete("/delete-user", isLoggedIn(), async (req, res, next) => {
  const { _id, relationship } = req.session.currentUser;
  try {
    if(relationship === 'business'){
      const user = await BusinessUser.findByIdAndDelete(_id)
    } else {
      const user = await AssoUser.findByIdAndDelete(_id)
    }
      res.status(200).json({message: `User is removed successfully.`})
  } catch (error) {
      res.json(error)
  }
});



module.exports = router;
