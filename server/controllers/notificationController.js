import Notifications from "../models/notificationModel.js";

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const notifications = await Notifications.find({ userId })
      .populate({
        path: "from",
        select: "firstName lastName profileUrl",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "successfully",
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notifications.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "successfully",
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    await Notifications.updateMany({ userId, read: false }, { read: true });

    res.status(200).json({
      success: true,
      message: "successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
