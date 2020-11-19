const express = require("express");
const router = express.Router();
const createError = require("http-errors");


/* GET home page. Add redirection to Signup, or Dashboard if logged iN*/
router.get('/', function(req, res, next) {
    res.status(200).json({message: "We arrived home!"})
  });
  
  module.exports = router