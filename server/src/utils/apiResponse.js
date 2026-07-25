/**
 * Standardized Success Response Utility
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data })
  });
};

/**
 * Standardized Error Response Utility
 */
const sendError = (res, error = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error
  });
};

module.exports = {
  sendSuccess,
  sendError
};
