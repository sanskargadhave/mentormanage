const NotificationSchema = require("../model/notificationsScema");

const getNotification = async (req, resp) => {
  try {
    const { id } = req.params; 
    const notifications = await NotificationSchema.find({receiverid: id}).sort({ createdAt: -1 }); 
    resp.status(200).json(notifications);
  } catch (err) {
    resp.status(500).json({ message: err.message || "Error fetching notifications" });
  }
};

module.exports = getNotification;