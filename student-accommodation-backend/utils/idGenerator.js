const crypto = require('crypto');

/**
 * Generates a unique application ID with the format: APP-YYYY-XXXXX
 * where YYYY is the current year and XXXXX is a random 5-character alphanumeric string
 */
exports.generateApplicationId = () => {
  const year = new Date().getFullYear();
  const randomString = crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()
    .slice(0, 5);
  
  return `APP-${year}-${randomString}`;
}; 