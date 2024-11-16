const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  message: { type: String, required: true },
  type: { type: String, enum: ['course', 'session', 'general'], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);