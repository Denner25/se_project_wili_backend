const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// URL validator helper
const validateURL = (value, helpers) => {
  if (!value || validator.isURL(value)) return value;
  return helpers.error("string.uri");
};

// -------------------------
// ITEM / MOODS VALIDATION
// -------------------------

// Validate item creation / update
const validateItem = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(1).max(100).messages({
      "string.empty": 'The "title" field must be filled in',
      "string.min": 'The minimum length of the "title" field is 1',
      "string.max": 'The maximum length of the "title" field is 100',
    }),
    itemId: Joi.number().required().messages({
      "number.base": 'The "itemId" field must be a number',
      "any.required": 'The "itemId" field is required',
    }),
    mediaType: Joi.string().required().valid("movie", "tv", "anime").messages({
      "any.only":
        'The "mediaType" field must be either "movie", "tv", or "anime"',
      "string.empty": 'The "mediaType" field must be filled in',
    }),
    poster: Joi.string().allow(null, "").custom(validateURL).messages({
      "string.uri": 'The "poster" field must be a valid URL',
    }),
    length: Joi.string().allow(null, "").max(30),
    moods: Joi.array().items(Joi.string().max(30)).default([]).messages({
      "array.base": 'The "moods" field must be an array of strings',
      "string.max": "Each mood must be at most 30 characters long",
    }),
  }),
});

// Validate moods update (PATCH /:itemId/moods)
const validateMoods = celebrate({
  body: Joi.object().keys({
    moods: Joi.array().items(Joi.string().max(30)).required().messages({
      "array.base": 'The "moods" field must be an array of strings',
      "string.max": "Each mood must be at most 30 characters long",
      "any.required": 'The "moods" field is required',
    }),
  }),
  params: Joi.object().keys({
    itemId: Joi.number().integer().required(),
  }),
});

// -------------------------
// USER VALIDATION
// -------------------------

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
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

// -------------------------
// PARAMETER VALIDATION
// -------------------------

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.number().integer().required(),
  }),
});

// -------------------------
// PROFILE UPDATE VALIDATION
// -------------------------

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatarUrl: Joi.string().custom(validateURL),
  }),
});

// -------------------------
// EXPORTS
// -------------------------

module.exports = {
  validateItem,
  validateMoods,
  validateUser,
  validateLogin,
  validateId,
  validateProfileUpdate,
};
