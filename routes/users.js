const express = require('express');
const {
  updateProfile,
  getUser,
} = require('../controllers/users');
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

exports.usersRoutes = usersRoutes;
