const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create", paymentController.createPayment);
router.post("/callback", paymentController.midtransCallback);

module.exports = router;