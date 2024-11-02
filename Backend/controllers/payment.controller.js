const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const order = async (req, res) => {
    const { amount } = req.body; // Amount in the smallest currency unit (e.g., paise for INR)
    try {
      const order = await razorpayInstance.orders.create({
        amount: amount * 100, // Convert amount to the smallest currency unit
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      });
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
const capture = async (req, res) => {
    const { paymentId } = req.body;
    try {
      const payment = await razorpayInstance.payments.capture(paymentId, amount);
      res.json({ success: true, payment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

module.exports = {order , capture}