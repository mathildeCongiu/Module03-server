const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const BusinessUser = require("../models/BusinessUser");
const AssoUser = require("../models/AssoUser");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post(
  "/signup/business",
  // revisamos si el user no está ya logueado usando la función helper (chequeamos si existe req.session.currentUser)
  isNotLoggedIn(),
  // revisa que se hayan completado los valores de username y password usando la función helper
  validationLoggin(),
  async (req, res, next) => {
    const {
      name,
      email,
      password,
      logo,
      street,
      number,
      flat,
      city,
      postcode,
      country,
      phoneNumber,
      description,
      typeName,
      pickupDate,
      pickupPlace,
    } = req.body;

    try {
      // chequea si el username ya existe en la BD
      const emailExists = await BusinessUser.findOne({ email }, "email");
      // si el usuario ya existe, pasa el error a middleware error usando next()
      if (emailExists) return next(createError(400));
      else {
        // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newBusinessUser = await BusinessUser.create({
          email,
          password: hashPass,
          name,
          // logo,
          // address: { street, number, flat, city, postcode, country },
          // phoneNumber,
          // description,
          type: { name: typeName },
          // pickup: { date: pickupDate, place: pickupPlace },
        });
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        req.session.currentUser = newBusinessUser;
        res
          .status(200) //  OK
          .json(newBusinessUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//  POST '/login'

// chequea que el usuario no esté logueado usando la función helper (chequea si existe req.session.currentUser)
// revisa que el username y el password se estén enviando usando la función helper
router.post(
  "/login/business",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // revisa si el usuario existe en la BD
      const user = await BusinessUser.findOne({ email });
      // si el usuario no existe, pasa el error al middleware error usando next()
      if (!user) {
        next(createError(404));
      }
      // si el usuario existe, hace hash del password y lo compara con el de la BD
      // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
      else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/signup/association",
  // revisamos si el user no está ya logueado usando la función helper (chequeamos si existe req.session.currentUser)
  isNotLoggedIn(),
  // revisa que se hayan completado los valores de username y password usando la función helper
  validationLoggin(),
  async (req, res, next) => {
    const {
      name,
      email,
      password,
      logo,
      street,
      number,
      flat,
      city,
      postcode,
      country,
      phoneNumber,
      description,
      typeName,
    } = req.body;

    try {
      // chequea si el username ya existe en la BD
      const emailExists = await AssoUser.findOne({ email }, "email");
      // si el usuario ya existe, pasa el error a middleware error usando next()
      if (emailExists) return next(createError(400));
      else {
        // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newAssoUser = await AssoUser.create({
          email,
          password: hashPass,
          name,
          logo,
          address: { street, number, flat, city, postcode, country },
          phoneNumber,
          description,
          type: { name: typeName },
        });
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        req.session.currentUser = newAssoUser;
        res
          .status(200) //  OK
          .json(newAssoUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login/association",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // revisa si el usuario existe en la BD
      const user = await AssoUser.findOne({ email });
      // si el usuario no existe, pasa el error al middleware error usando next()
      if (!user) {
        next(createError(404));
      }
      // si el usuario existe, hace hash del password y lo compara con el de la BD
      // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
      else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST '/logout'

// revisa si el usuario está logueado usando la función helper (chequea si la sesión existe), y luego destruimos la sesión
router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  //  - setea el código de estado y envía de vuelta la respuesta
  res
    .status(204) //  No Content
    .send();
  return;
});

// GET '/private'   --> Only for testing

// revisa si el usuario está logueado usando la función helper (chequea si existe la sesión), y devuelve un mensaje
// router.get("/private", isLoggedIn(), (req, res, next) => {
//   //  - setea el código de estado y devuelve un mensaje de respuesta json
//   res
//     .status(200) // OK
//     .json({ message: "Test - User is logged in" });
// });

// GET '/me'

// chequea si el usuario está logueado usando la función helper (chequea si existe la sesión)
router.get("/me", isLoggedIn(), (req, res, next) => {
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;
