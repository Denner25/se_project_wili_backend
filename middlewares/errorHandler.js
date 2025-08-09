const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  const { statusCode = ERROR_CODES.INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === ERROR_CODES.INTERNAL_SERVER_ERROR
        ? ERROR_MESSAGES.SERVER_ERROR
        : message,
  });
};

module.exports = { errorHandler };
