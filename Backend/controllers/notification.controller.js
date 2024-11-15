const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const query = req.admin ? { adminId: req.admin._id } : {};
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate("adminId", "name avatar"); // Populate adminId to include name and avatar
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};


// Mark Notification as Read
const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Create Notification
const createNotification = async (req, res) => {
  const { message, type } = req.body;
  try {
    const newNotification = new Notification({
      adminId: req.admin._id, // Admin creates the notification
      message,
      type
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};




const sendNotificationToCourseStudents = async (adminId, courseId, content, type) => {
    try {
        // Get the course to find the enrolled students
        const course = await Course.findById(courseId).populate('enrolledStudents');
        if (!course) {
            throw new Error('Course not found!');
        }

        // Loop through the enrolled students and send them the notification
        for (let student of course.enrolledStudents) {
            // You can skip users who have opted out of this notification type
            if (student.optedOutNotifications && student.optedOutNotifications[type]) {
                continue;
            }

            // Create notification for each enrolled student
            const notification = new Notification({
                adminId,
                userId: student._id,
                content,
                type,
                isRead: false
            });

            await notification.save();
        }
    } catch (error) {
        console.error('Error sending notification to course students:', error);
    }
};

module.exports = { getNotifications, deleteNotification, createNotification, markAsRead , sendNotificationToCourseStudents};
