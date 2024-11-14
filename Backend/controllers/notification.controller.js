const Notification = require('../models/notification.model');

const getNotifications = async (req, res) => {
  const { userId, adminId } = req.query;
  try {
    const query = userId ? { userId } : { adminId };
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};


const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};


const createNotification = async (req, res) => {
  const { userId, adminId, message, type } = req.body;
  try {
    const newNotification = new Notification({
      userId,
      adminId,
      message,
      type
    });
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

module.exports = {getNotifications,deleteNotification,createNotification,markAsRead};