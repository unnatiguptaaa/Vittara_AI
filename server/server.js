import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './seed/seeder.js';

import chatRoutes from './routes/chatRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import termRoutes from './routes/termRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup: Allow local dev ports (Vite 3000/5173, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key', 'x-language']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health and Status API
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());

  res.status(200).json({
    status: 'healthy',
    application: 'Vittara AI API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      mode: dbStatus.isInMemory ? 'in-memory-mongodb' : 'mongodb-cluster',
      host: dbStatus.host || 'local',
      name: dbStatus.name || 'vittara_ai'
    },
    ai: {
      provider: 'Google Gemini 3.8 Flash',
      serverKeyConfigured: hasGeminiKey,
      status: hasGeminiKey ? 'ready' : 'ready-with-deterministic-orchestrator'
    }
  });
});

// Configure and reconnect MongoDB endpoint
app.post('/api/config/db', async (req, res, next) => {
  try {
    const { mongodbUri } = req.body;
    if (!mongodbUri || !mongodbUri.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a valid MongoDB connection string.' });
    }

    const cleanUri = mongodbUri.trim();
    process.env.MONGODB_URI = cleanUri;

    // Connect and seed to the provided MongoDB database
    const conn = await connectDB(cleanUri);
    await seedDatabase(false);

    res.status(200).json({
      success: true,
      message: conn.isInMemory ? 'MongoDB connection failed; retained in-memory mode.' : 'Successfully connected to MongoDB cluster.',
      database: conn
    });
  } catch (err) {
    next(err);
  }
});

// Database re-seed endpoint
app.post('/api/seed', async (req, res, next) => {
  try {
    const result = await seedDatabase(true);
    res.status(200).json({
      success: true,
      message: 'Database reseeded successfully.',
      result
    });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/chat', chatRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/loans', loanRoutes); // Alias for direct GET /api/loans
app.use('/api/insurance', insuranceRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/document', documentRoutes);

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handling
app.use(errorHandler);

// Boot server & connect database
async function startServer(targetPort = Number(PORT)) {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(targetPort, () => {
      console.log(`====================================================`);
      console.log(`🚀 Vittara AI Backend Server running on port ${targetPort}`);
      console.log(`📡 Health Check: http://localhost:${targetPort}/api/health`);
      console.log(`🧠 AI Orchestrator & Database Seeded & Ready`);
      console.log(`====================================================`);

      // Record active port for clients and verification
      try {
        fs.writeFileSync('./.port.json', JSON.stringify({ port: targetPort }));
      } catch (e) {
        // ignore
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Server] Port ${targetPort} is in use, trying port ${targetPort + 1}...`);
        startServer(targetPort + 1);
      } else {
        console.error('[Server] Fatal server error:', err);
      }
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
