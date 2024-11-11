
const axios = require('axios');

const createRoom = async (req, res) => {
  try {
    const { courseId, startNow, scheduledDate } = req.body;
    console.log("Received data:", { courseId, startNow, scheduledDate });  // Log received data

    let roomProperties = { enable_chat: true, start_audio_off: true };
    
    // If the room is to be scheduled, use the scheduled date
    if (!startNow && scheduledDate) {
      console.log("Scheduling room for:", scheduledDate);
      roomProperties.scheduled_time = new Date(scheduledDate).toISOString();  // Ensure correct format
    }

    const response = await axios.post(
      'https://api.daily.co/v1/rooms',
      { properties: roomProperties },
      { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
    );

    // Log the room creation response
    console.log("Room created successfully:", response.data);
    
    // Send the response back to the client
    res.json({ success: true, roomData: response.data });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).send({ success: false, message: 'Error creating room' });
  }
};


module.exports = { createRoom };
