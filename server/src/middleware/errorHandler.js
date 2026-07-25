const { sendError } = require('../utils/apiResponse');

/**
 * Higher-order async handler function to catch errors and pass them to error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global Error Handling Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('[Global Error]', err);

  const message = process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred';
  return sendError(res, message, err.statusCode || 500);
};

module.exports = {
  asyncHandler,
  globalErrorHandler
};
