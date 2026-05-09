require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// auth routes
app.use('/api/auth', require('./routes/auth.routes'));

// venue routes
app.use('/api/venues', require('./routes/venue/venue.routes'));

// booking routes
app.use('/api/bookings', require('./routes/booking.routes'));

// static images
app.use('/uploads', express.static('src/uploads'));

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
