const { ERROR_MESSAGES } = require("./errors");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const InternalServerError = require("../errors/internal-server-err");

// For create/update operations (Validation + Cast)
const handleValidationAndCastError = (err, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
  } else {
    next(err);
  }
};

// For find by ID operations (Cast + NotFound)
const handleCastAndNotFoundError = (err, next) => {
  if (err.name === "CastError") {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
  } else if (err.name === "DocumentNotFoundError") {
    next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
  } else {
    next(err);
  }
};

// For user creation (Validation + Cast + Conflict)
const handleUserCreationError = (err, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
  } else if (err.code === 11000) {
    next(new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS));
  } else {
    next(err);
  }
};

// For login (missing fields handled in controller, here only credential and server errors)
const handleLoginError = (err, next) => {
  if (err.message === "Incorrect email or password") {
    next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
  } else {
    next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

module.exports = {
  handleValidationAndCastError,
  handleCastAndNotFoundError,
  handleUserCreationError,
  handleLoginError,
};
