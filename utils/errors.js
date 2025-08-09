const ERROR_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data provided",
  INVALID_ID: "Invalid ID format",
  NOT_FOUND: "Resource not found",
  USER_NOT_FOUND: "User not found",
  SERVER_ERROR: "An error has occurred on the server",
  INVALID_CREDENTIALS: "Incorrect email or password",
  FORBIDDEN: "Access denied: insufficient permissions",
  UNAUTHORIZED: "Authorization required or token is missing",
  EMAIL_EXISTS: "A user with this email already exists",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
