const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Set bufferCommands BEFORE connecting
mongoose.set('bufferCommands', false);

const app = express();

// ✅ CORS – Allow all origins
app.use(cors());

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const timelogRoutes = require('./routes/timelogs');
const invoiceRoutes = require('./routes/invoices');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/timelogs', timelogRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ProjexHub API is running 🚀' });
});

// ✅ Wait for MongoDB connection BEFORE starting server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log('❌ MongoDB Error:', err));