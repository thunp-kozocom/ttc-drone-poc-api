/**
 * =========================
 * ERROR DEFINITIONS
 * =========================
 */

const ERROR_CODES = {
  BAD_REQUEST: "400-0008-01",
  UNAUTHORIZED: "401-0008-01",
  INTERNAL_SERVER_ERROR: "500-0008-01",
  NOT_FOUND: "404-0008-01",
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "パラメータが不正です",
  UNAUTHORIZED: "認証できません",
  INTERNAL_SERVER_ERROR: "サーバエラーです",
  NOT_FOUND: "リソースが見つかりません",
};

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(statusCode, errorCode, uiMessage, details = null) {
    super(uiMessage);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.uiMessage = uiMessage;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * BadRequest Error (400)
 */
class BadRequestError extends AppError {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST, details = null) {
    super(400, ERROR_CODES.BAD_REQUEST, message, details);
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED, details = null) {
    super(401, ERROR_CODES.UNAUTHORIZED, message, details);
  }
}

/**
 * NotFound Error (404)
 */
class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_FOUND, details = null) {
    super(404, ERROR_CODES.NOT_FOUND, message, details);
  }
}

/**
 * InternalServerError (500)
 */
class InternalServerError extends AppError {
  constructor(message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details = null) {
    super(500, ERROR_CODES.INTERNAL_SERVER_ERROR, message, details);
  }
}

/**
 * Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // If error is an instance of AppError, use its properties
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      name: err.name,
      status: err.statusCode,
      errorCode: err.errorCode,
      uiMessage: err.uiMessage,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      name: "BadRequest",
      status: 400,
      errorCode: ERROR_CODES.BAD_REQUEST,
      uiMessage: ERROR_MESSAGES.BAD_REQUEST,
      details: err.message,
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      name: "BadRequest",
      status: 400,
      errorCode: ERROR_CODES.BAD_REQUEST,
      uiMessage: ERROR_MESSAGES.BAD_REQUEST,
      details: "Invalid JSON format",
    });
  }

  // Handle Authorization header errors from API Gateway
  if (
    err.message &&
    err.message.includes("Invalid key=value pair") &&
    err.message.includes("Authorization header")
  ) {
    return res.status(401).json({
      name: "Unauthorized",
      status: 401,
      errorCode: ERROR_CODES.UNAUTHORIZED,
      uiMessage: ERROR_MESSAGES.UNAUTHORIZED,
      details: "Invalid Authorization header format. Expected: 'Bearer <token>'",
    });
  }

  // Default to Internal Server Error
  return res.status(500).json({
    name: "InternalServerError",
    status: 500,
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    uiMessage: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ERROR_CODES,
  ERROR_MESSAGES,
  errorHandler,
};
