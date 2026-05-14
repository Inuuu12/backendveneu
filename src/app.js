require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://carivenue.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/venues', require('./routes/venue/venue.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'GET API berhasil'
  });
});

app.post('/api/test', (req, res) => {
  res.json({
    message: 'Data diterima',
    data: req.body
  });
});

module.exports = app;
