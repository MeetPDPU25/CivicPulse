const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root informative landing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CivicPulse API - Port 5000</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 90vh; margin: 0; padding: 20px;">
        <div style="background: #1e293b; max-width: 540px; width: 100%; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #fff;">CivicPulse Backend API is Live!</h2>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
            This is the REST API server on <strong>Port 5000</strong>. It handles database queries, image uploads, and authentication.
          </p>
          <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; color: #38bdf8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
              To view the frontend web portal:
            </p>
            <a href="http://localhost:3000" style="display: inline-block; color: #ffffff; background: #0284c7; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 4px;">
              Open Web App &rarr; http://localhost:3000
            </a>
          </div>
          <p style="color: #64748b; font-size: 11px; margin: 0; text-align: center;">
            Base URL: <code>http://localhost:5000/api</code> • Database: <code>MySQL (test_civic)</code>
          </p>
        </div>
      </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Public Complaint & Civic Issue Tracking System'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Initialize DB and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Civic Complaint API running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
