const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItemBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(1).max(100).messages({
      "string.empty": 'The "title" field must be filled in',
      "string.min": 'The minimum length of the "title" field is 1',
      "string.max": 'The maximum length of the "title" field is 100',
    }),
    tmdbId: Joi.number().required().messages({
      "number.base": 'The "tmdbId" field must be a number',
      "any.required": 'The "tmdbId" field is required',
    }),
    mediaType: Joi.string().required().valid("movie", "tv").messages({
      "any.only": 'The "mediaType" field must be either "movie" or "tv"',
      "string.empty": 'The "mediaType" field must be filled in',
    }),
    poster: Joi.string().allow(null, "").custom(validateURL).messages({
      "string.uri": 'The "poster" field must be a valid url',
    }),
    length: Joi.string().allow(null, "").max(30),
    tags: Joi.array().items(Joi.string().max(30)).default([]).messages({
      "array.base": 'The "tags" field must be an array of strings',
      "string.max": "Each tag must be at most 30 characters long",
    }),
  }),
});

const validateItemTags = celebrate({
  body: Joi.object().keys({
    tags: Joi.array().items(Joi.string().max(30)).required().messages({
      "array.base": 'The "tags" field must be an array of strings',
      "string.max": "Each tag must be at most 30 characters long",
      "any.required": 'The "tags" field is required',
    }),
  }),
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    // avatar removed
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    // avatar removed
  }),
});

module.exports = {
  validateItemBody,
  validateItemTags,
  validateUserBody,
  validateLogin,
  validateId,
  validateProfileUpdate,
};
