import axios from 'axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleRazorpayPayment = async (amount, courseId) => {
  // Load Razorpay's external script
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    console.error("Razorpay SDK failed to load.");
    return;
  }

  // Create an order with the backend
  try {
    const orderResponse = await axios.post(
      'http://localhost:3000/user/buyCourse/order', // Using /user prefix
      { amount },
      { withCredentials: true } // Ensure cookies are sent with the request
    );

    const { id: order_id, currency } = orderResponse.data.order;

    // Additional checks to ensure the order was created successfully
    if (!orderResponse.data.success) {
      throw new Error("Order creation failed: " + orderResponse.data.error);
    }

    const options = {
      key: rzp_test_3cor56FNTh7QMY, // Replace with your Razorpay key ID
      amount: amount * 100, // Amount in smallest currency unit
      currency,
      name: 'Your Course Platform',
      description: 'Course Purchase',
      order_id,
      handler: async function (response) {
        // Capture the payment
        try {
          const captureResponse = await axios.post(
            'http://localhost:3000/user/buyCourse/capture', // Using /user prefix
            {
              paymentId: response.razorpay_payment_id,
              amount,
              courseId,
            },
            { withCredentials: true } // Ensure cookies are sent with the request
          );

          if (captureResponse.data.success) {
            alert("Payment Successful!");
          } else {
            throw new Error("Payment capture failed: " + captureResponse.data.error);
          }
        } catch (error) {
          console.error("Error in capturing payment", error);
          alert("Payment capture failed.");
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Error in creating Razorpay order", error);
    alert("Failed to create order. Please try again.");
  }
};

export default handleRazorpayPayment;
