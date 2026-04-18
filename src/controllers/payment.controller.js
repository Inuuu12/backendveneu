exports.createPayment = (req, res) => {
  res.json({
    message: "Create payment (Midtrans)",
    booking_id: req.body.booking_id
  });
};

exports.midtransCallback = (req, res) => {
  res.json({
    message: "Midtrans callback received",
    data: req.body
  });
};