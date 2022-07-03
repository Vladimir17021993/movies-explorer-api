const { celebrate, Joi, Segments } = require('celebrate');
// eslint-disable-next-line no-unused-vars
const { required } = require('joi');
const validator = require('validator');

const register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
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
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
    }),
  }),
});

const updateProfile = celebrate({
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
});

const movieId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
      .messages({
        'any.required': 'Id не указан.',
        'string.lenght': 'Id должен быть 24 символа',
      }),
  }),
});

const movie = celebrate({
  [Segments.BODY]: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(2),
    year: Joi.number().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url постера не указан.',
        'string.notUrl': 'Url постера некорректный.',
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url трейлера не указан.',
        'string.notUrl': 'Url трейлера некорректный.',
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url мини постера не указан.',
        'string.notUrl': 'Url мини постера некорректный.',
      }),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

module.exports = {
  register,
  updateProfile,
  movieId,
  movie,
};
