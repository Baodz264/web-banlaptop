import Notification from "../database/mongo/notification/notification.schema.js";

const notificationSocket = (io, socket) => {

  socket.on("join_notification", (user_id) => {
    socket.join(`user_${user_id}`);
  });

  socket.on("leave_notification", (user_id) => {
    socket.leave(`user_${user_id}`);
  });

  // send notification (chỉ broadcast, không create DB)
  socket.on("send_notification", async (data) => {

    try {

      const { user_id } = data;

      io.to(`user_${user_id}`).emit("receive_notification", data);

    } catch (error) {

      socket.emit("notification_error", error.message);

    }

  });

  socket.on("read_notification", async ({ notification_id, user_id }) => {

    try {

      const notification = await Notification.findByIdAndUpdate(
        notification_id,
        { is_read: true },
        { new: true }
      );

      io.to(`user_${user_id}`).emit("notification_read", notification);

    } catch (error) {

      socket.emit("notification_error", error.message);

    }

  });

};

export default notificationSocket;
