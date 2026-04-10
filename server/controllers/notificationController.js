import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Notification } from "../models/notificationModel.js";

// GET all notifications (role-based)
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
  const role = req.user.role;

  const notifications = await Notification.find({
    forRole: { $in: [role, "all"] },
  })
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = notifications.filter((n) => !n.read).length;

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

// MARK all as read
export const markAllRead = catchAsyncErrors(async (req, res, next) => {
  const role = req.user.role;

  await Notification.updateMany(
    { forRole: { $in: [role, "all"] }, read: false },
    { read: true }
  );

  res.status(200).json({ success: true, message: "All notifications marked as read" });
});

// DELETE a notification
export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Notification deleted" });
});