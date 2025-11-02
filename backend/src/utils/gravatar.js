
const crypto = require('crypto');
module.exports = function(email) {
  if (!email) return null;
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
};
