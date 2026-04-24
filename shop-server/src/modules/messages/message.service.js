import MessageRepository from "./message.repository.js";
import AttachmentRepository from "../attachments/attachment.repository.js";

class MessageService {
  static async getMessages(query) {
    try {
      const result = await MessageRepository.findAll(query);

      const messages = Array.isArray(result?.data) ? result.data : [];

      if (messages.length === 0) {
        return {
          ...result,
          data: [],
        };
      }

      // =========================
      // SAFE MESSAGE IDS
      // =========================
      const messageIds = messages
        .map((m) => m?._id)
        .filter(Boolean);

      // =========================
      // LOAD ATTACHMENTS SAFE
      // =========================
      const attachmentsMap = {};

      await Promise.all(
        messageIds.map(async (id) => {
          try {
            const data = await AttachmentRepository.findByMessage(id);
            attachmentsMap[id.toString()] = data || [];
          } catch (err) {
            console.error("Attachment load error:", err);
            attachmentsMap[id.toString()] = [];
          }
        })
      );

      // =========================
      // MERGE RESULT
      // =========================
      const messagesWithAttachments = messages.map((msg) => {
        const plain = msg?.toObject ? msg.toObject() : msg;

        return {
          ...plain,
          attachments: attachmentsMap[msg._id?.toString()] || [],
        };
      });

      return {
        ...result,
        data: messagesWithAttachments,
      };

    } catch (err) {
      console.error("🔥 MessageService.getMessages ERROR:", err);

      // ❗ KHÔNG CHO CRASH SERVER
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      };
    }
  }

  static async getMessageById(id) {
    try {
      const message = await MessageRepository.findById(id);

      if (!message) {
        return null;
      }

      const attachments = await AttachmentRepository.findByMessage(id);

      return {
        ...(message.toObject ? message.toObject() : message),
        attachments: attachments || [],
      };

    } catch (err) {
      console.error("🔥 getMessageById ERROR:", err);
      throw err;
    }
  }

  static async createMessage(data) {
    return await MessageRepository.create(data);
  }

  static async updateMessage(id, data) {
    const message = await MessageRepository.findById(id);

    if (!message) {
      throw new Error("Không tìm thấy tin nhắn");
    }

    return await MessageRepository.update(id, data);
  }

  static async deleteMessage(id) {
    const message = await MessageRepository.findById(id);

    if (!message) {
      throw new Error("Không tìm thấy tin nhắn");
    }

    return await MessageRepository.delete(id);
  }
}

export default MessageService;
