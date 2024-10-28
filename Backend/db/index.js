const mongoose = require('mongoose');

module.exports = async() => {
  const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
  mongoose.connect(MONGO_CONNECTION_STRING);
}