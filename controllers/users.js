require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');
const ErrorConflict = require('../utils/ErrorConflict');
const { SALT_ROUNDS, JWT_DEV } = require('../config/index');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с Id ${req.user._id} не найден.`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с ID ${req.user._id} не найден.`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже зарегестрирован.`);
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, '+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Не правильный логин или пароль.');
      }
      return bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          throw new ErrorUnauthorized('Не правильный логин или пароль.');
        }
        const id = user._id.toString();
        const token = jwt.sign(
          { _id: id },
          NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
          { expiresIn: '7d' },
        );
        res.send({ jwt: token });
      });
    })
    .catch(next);
};
