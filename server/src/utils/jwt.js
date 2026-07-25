const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for a given user ID and optional role.
 */
const generateToken = (userId, role = 'user') => {
  const payload = {
    user: {
      id: userId,
      role
    }
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Verifies a JWT token.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
