const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, link) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      link,
      read: false
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
};

module.exports = { createNotification };