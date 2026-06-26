const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS setup - Allow all origins (fix for 404 error)
app.use(cors({
  origin: ['https://projexhubapp.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const timelogRoutes = require('./routes/timelogs');
const invoiceRoutes = require('./routes/invoices');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications'); // ✅ NEW

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/timelogs', timelogRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes); // ✅ NEW

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ProjexHub API is running 🚀' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});