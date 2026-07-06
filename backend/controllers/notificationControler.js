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

const getLetestNotification = async (req, resp) => {
  try {
    const { id} = req.params; 
    const {after}=req.query;
    const notifications = await NotificationSchema.find({ receiverid: id,
      createdAt: {
        $gt: new Date(after)
      }
    }).sort({ createdAt: -1 }); 
    resp.status(200).json(notifications);
  } catch (err) {
    resp.status(500).json({ message: err.message || "Error fetching notifications" });
  }
};


module.exports = {getNotification,getLetestNotification};