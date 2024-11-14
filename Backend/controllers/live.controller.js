
// const axios = require('axios');

// const createRoom = async (req, res) => {
//   try {
//     const { courseId, startNow, scheduledDate } = req.body; // Extract data from the request body

//     // Check if you want to start the room now or schedule for later
//     const roomData = {
//       properties: {
//         enable_chat: true,
//         start_audio_off: true,
//       },
//     };

//     if (!startNow && scheduledDate) {
//       // Set a scheduled date for later room creation (you'll need to implement scheduling logic)
//       // Example: this will just pass the scheduledDate; modify as per your backend logic for scheduling
//       roomData.properties.scheduled_at = new Date(scheduledDate).toISOString(); // Ensure correct formatting
//     }

//     // Make the request to the Daily.co API to create the room
//     const response = await axios.post('https://api.daily.co/v1/rooms', roomData, {
//       headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
//     });

//     // Respond with the room details (URL, ID, etc.)
//     res.json(response.data); 
//   } catch (error) {
//     console.error("Error creating room:", error);
//     res.status(500).send('Error creating room');
//   }
// };

// module.exports = { createRoom };
const axios = require('axios');
const cron = require('node-cron');

const createRoom = async (req, res) => {
  try {
    const { courseId, startNow, scheduledDate } = req.body;

    const roomData = {
      properties: {
        enable_chat: true,
        start_audio_off: true,
      },
    };

    // Check if you want to start now or schedule for later
    if (startNow) {
      // Create the room immediately
      const response = await axios.post('https://api.daily.co/v1/rooms', roomData, {
        headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
      });
      return res.json(response.data);
    } else if (scheduledDate) {
    
      const scheduleTime = new Date(scheduledDate);
      const now = new Date();

      if (scheduleTime > now) {
        
        cron.schedule(
          `${scheduleTime.getSeconds()} ${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`,
          async () => {
            try {
              const response = await axios.post('https://api.daily.co/v1/rooms', roomData, {
                headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
              });
              console.log('Scheduled room created:', response.data);
            } catch (error) {
              console.error('Error creating scheduled room:', error);
            }
          },
          { scheduled: true }
        );

        return res.json({ message: 'Room creation scheduled successfully' });
      } else {
        return res.status(400).json({ error: 'Scheduled date must be in the future' });
      }
    } else {
      res.status(400).json({ error: 'Invalid parameters' });
    }
  } catch (error) {
    console.error('Error in createRoom:', error);
    res.status(500).send('Error creating room');
  }
};

module.exports = { createRoom };
