const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const venueRoutes = require('./routes/venue/venue.routes');
const bookingRoutes = require('./routes/booking.routes'); 
const authRoutes = require('./routes/auth.routes'); 
// const paymentRoutes = require('./routes/payment.routes'); // Not yet active

app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/auth', authRoutes); 

// module.exports = app must come before other route definitions if they refer back to it
// but typically we put all app.use before module.exports
module.exports = app;

// Health Checks / Test APIs
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'GET API berhasil'
  });
});

app.post("/api/test", (req, res) => {
  const data = req.body;
  res.json({
    message: "Data diterima",
    data
  });
});