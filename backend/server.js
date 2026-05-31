require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectWithRetry } = require('./db');
const authMiddleware = require('./middleware/auth');

const memberRoutes = require('./routes/member');
const bookRoutes = require('./routes/book');
const issuanceRoutes = require('./routes/issuance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Health check (auth is skipped for this route)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/member', memberRoutes);
app.use('/book', bookRoutes);
app.use('/issuance', issuanceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after DB connection
async function start() {
  try {
    await connectWithRetry();
    app.listen(PORT, () => {
      console.log(`🚀 LibMgmt API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
