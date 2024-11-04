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

const handleRazorpayPayment = async (courseId, onSuccess) => {
  try {
    // Load Razorpay SDK
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load.");
    }

    // First, get course details including price
    const courseResponse = await axios.get(
      `http://localhost:3000/courses/${courseId}`,
      { withCredentials: true }
    );
    
    const amount = courseResponse.data.price;

    console.log("hello");
    // Create order //dikkat
    const orderResponse = await axios.post(
      'http://localhost:3000/user/buyCourse/order',
      { amount, courseId },
      { withCredentials: true }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.error || "Failed to create order");
    }

    const { order } = orderResponse.data;
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount,
      currency: order.currency,
      name: 'Course Platform',
      description: `Purchase for ${courseResponse.data.title}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          const captureResponse = await axios.post(
            'http://localhost:3000/user/buyCourse/capture',
            {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              courseId,
              amount
            },
            { withCredentials: true }
          );

          if (captureResponse.data.success) {
            onSuccess();
          } else {
            throw new Error(captureResponse.data.error || "Payment capture failed");
          }
        } catch (error) {
          console.error("Payment capture error:", error);
          throw new Error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: courseResponse.data.teacher.name,
        email: courseResponse.data.teacher.email
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error("Payment process error:", error);
    throw error;
  }
};

export default handleRazorpayPayment;