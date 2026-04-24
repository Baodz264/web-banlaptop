import Message from "../database/mongo/chat/message.schema.js";
import Chat from "../database/mongo/chat/chat.schema.js";
import Attachment from "../database/mongo/chat/attachment.schema.js";
import User from "../database/mysql/user/user.model.js";

const chatSocket = (io, socket) => {
  console.log("💬 Chat socket ready:", socket.id);

  // =========================================
  // JOIN CHAT ROOM
  // =========================================
  socket.on("join_chat", (chat_id) => {
    if (!chat_id) return;

    const room = `chat_${chat_id}`;
    socket.join(room);

    console.log(`👤 ${socket.id} joined ${room}`);
  });

  // =========================================
  // SEND MESSAGE (FIXED)
  // =========================================
  socket.on("send_message", async (data) => {
    try {
      const {
        chat_id,
        sender_id,
        message,
        message_type,
        reply_to,
        attachments,
      } = data;

      if (!chat_id || !sender_id) {
        socket.emit("chat_error", "Missing chat_id or sender_id");
        return;
      }

      const room = `chat_${chat_id}`;

      // ======================
      // GET USER FROM DB
      // ======================
      const senderInfo = await User.findByPk(sender_id);

      if (!senderInfo) {
        socket.emit("chat_error", "Sender not found");
        return;
      }

      // ======================
      // CREATE MESSAGE
      // ======================
      const newMessage = await Message.create({
        chat_id,
        sender_id,
        sender_role: senderInfo.role,
        message: message || "",
        message_type: message_type || "text",
        reply_to: reply_to || null,
      });

      // ======================
      // SAVE ATTACHMENTS
      // ======================
      let attachmentDocs = [];

      if (attachments && attachments.length > 0) {
        const attachmentData = attachments.map((file) => ({
          message_id: newMessage._id,
          file_url: file.file_url,
          file_type: file.file_type,
          file_size: file.file_size || 0,
        }));

        attachmentDocs = await Attachment.insertMany(attachmentData);
      }

      // ======================
      // UPDATE CHAT + GET INFO (🔥 QUAN TRỌNG)
      // ======================
      const chat = await Chat.findByIdAndUpdate(
        chat_id,
        {
          last_message_at: new Date(),
        },
        { new: true }
      );

      if (!chat) {
        socket.emit("chat_error", "Chat not found");
        return;
      }

      // ======================
      // RESPONSE OBJECT
      // ======================
      const messageResponse = {
        ...newMessage.toObject(),
        attachments: attachmentDocs,
        sender: {
          id: senderInfo.id,
          name: senderInfo.name,
          avatar: senderInfo.avatar,
          role: senderInfo.role,
        },
      };

      // =========================================
      // EMIT TO ROOM (CHAT BOX)
      // =========================================
      io.to(room).emit("receive_message", messageResponse);

      // =========================================
      // EMIT CHAT LIST UPDATE (🔥 FIX CHÍNH)
      // =========================================
      io.emit("new_message", {
        chat_id,
        sender_id,
        admin_id: chat.admin_id,
        customer_id: chat.customer_id,
        last_message: messageResponse,
      });

    } catch (error) {
      console.error("❌ Send message error:", error);
      socket.emit("chat_error", error.message);
    }
  });

  // =========================================
  // RECALL MESSAGE
  // =========================================
  socket.on("recall_message", async ({ message_id, chat_id }) => {
    try {
      if (!message_id || !chat_id) return;

      const room = `chat_${chat_id}`;

      const message = await Message.findByIdAndUpdate(
        message_id,
        { is_recalled: true },
        { new: true }
      );

      io.to(room).emit("message_recalled", message);

    } catch (error) {
      console.error("❌ Recall message error:", error);
      socket.emit("chat_error", error.message);
    }
  });

  // =========================================
  // TYPING
  // =========================================
  socket.on("typing", ({ chat_id, user_id }) => {
    if (!chat_id || !user_id) return;

    socket.to(`chat_${chat_id}`).emit("user_typing", {
      chat_id,
      user_id,
    });
  });

  socket.on("stop_typing", ({ chat_id, user_id }) => {
    if (!chat_id || !user_id) return;

    socket.to(`chat_${chat_id}`).emit("user_stop_typing", {
      chat_id,
      user_id,
    });
  });

  // =========================================
  // DISCONNECT
  // =========================================
  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
};

export default chatSocket;
