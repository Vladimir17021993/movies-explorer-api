require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorForbidden = require('../utils/ErrorForbidden');
const { JWT_DEV } = require("../config/index");

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');
  if (!req.headers.authorization) {
    return next(new ErrorForbidden('Нет заголовка authorization'));
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : JWT_DEV,
    );
  } catch (err) {
    return next(new ErrorForbidden('Нет прав'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
