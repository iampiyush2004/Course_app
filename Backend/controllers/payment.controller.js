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
};

const capture = async (req, res) => {
    const { paymentId, amount, courseId } = req.body;
    const userId = req.user.id; 

    try {
        // Capture the payment on Razorpay
        const payment = await razorpayInstance.payments.capture(paymentId, amount * 100);

      
        const user = await User.findById(userId);

        if (!user.coursePurchased.includes(courseId)) {
            user.coursePurchased.push(courseId);
            await user.save();
        }

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const hasPurchased = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
      const user = await User.findById(userId);
      const hasPurchased = user.coursePurchased.includes(courseId);
      res.json({ success: true, hasPurchased });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {order , capture , hasPurchased}