const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const {
  updateProfile,
  getUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', auth, getUser);

usersRoutes.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).messages({
        'string.min': 'Имя не может быть короче 2ух символов',
        'string.max': 'Имя не может быть длинее 30 символов',
      }),
      email: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isEmail(value)) {
          return helper.error('string.notEmail');
        }
        return value;
      })
      .messages({
        'any.required': 'Email не указан',
        'string.notEmail': 'Email некорректный',
      }),
    }),
  }),
  express.json(),
  auth,
  updateProfile,
);

exports.usersRoutes = usersRoutes;
