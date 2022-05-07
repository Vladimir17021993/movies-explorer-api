const express = require('express');
const {
  updateProfile,
  getUser,
  createUser,
  login,
} = require("../controllers/users");
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validations');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', auth, getUser);

usersRoutes.patch(
  '/users/me',
  validators.updateProfile,
  express.json(),
  auth,
  updateProfile,
);

usersRoutes.post(
  "/signup",
  validators.register,
  express.json(),
  createUser
);

usersRoutes.post("/signin", validators.register, express.json(), login);

exports.usersRoutes = usersRoutes;
