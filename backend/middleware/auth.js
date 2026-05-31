function authMiddleware(req, res, next) {
  // Skip auth for health check
  if (req.path === '/health' && req.method === 'GET') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res
      .status(401)
      .json({ error: 'Unauthorized: invalid or missing API key' });
  }

  next();
}

module.exports = authMiddleware;
