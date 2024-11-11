const axios = require('axios');
const createRoom =  async (req, res) => {
    try {
      const response = await axios.post(
        'https://api.daily.co/v1/rooms',
        { properties: { enable_chat: true, start_audio_off: true } }, // Set desired room properties
        { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
      );
      res.json(response.data); // Respond with room details
    } catch (error) {
      res.status(500).send('Error creating room');
    }
  }
  module.exports = {createRoom}