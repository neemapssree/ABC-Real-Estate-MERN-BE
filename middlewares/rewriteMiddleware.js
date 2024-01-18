const path = require('path');

const rewriteMiddleware = (req, res, next) => {
  // Serve index.html for all routes
  res.sendFile(path.join(__dirname, './build', 'index.html'));
};

module.exports = rewriteMiddleware;