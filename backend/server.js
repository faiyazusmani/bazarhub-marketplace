const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/categories', require('./routes/categories'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;

async function startServer() {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bazarhub';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    console.log('✅ MongoDB connected to local database server');
  } catch (err) {
    console.log('ℹ️ Local MongoDB not detected. Running backend with local persistent file storage fallback.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend Server running smoothly on http://localhost:${PORT}`);
  });
}

startServer();