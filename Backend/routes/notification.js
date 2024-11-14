const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification
} = require('../controllers/notification.controller');

//  get notifications for a specific user or admin
router.get('/', getNotifications);

//  create a new notification
router.post('/', createNotification);

//  mark a notification as read
router.patch('/:notificationId/read', markAsRead);

//  delete a notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
