import mongoose from "mongoose";
import Message from "../../database/mongo/chat/message.schema.js";

class MessageRepository {

  static async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      const message = await Message.findById(id).lean();
      return message;

    } catch (err) {
      console.error("🔥 findById ERROR:", err);
      throw err;
    }
  }

  static async findAll(query) {
    try {
      let { chat_id, sender_id, page = 1, limit = 20 } = query;

      // =========================
      // SAFE NUMBER CONVERT
      // =========================
      page = parseInt(page);
      limit = parseInt(limit);

      if (isNaN(page) || page <= 0) page = 1;
      if (isNaN(limit) || limit <= 0) limit = 20;

      const filter = {};

      // =========================
      // CHAT_ID SAFE
      // =========================
      if (chat_id) {
        if (mongoose.Types.ObjectId.isValid(chat_id)) {
          filter.chat_id = chat_id;
        } else {
          return {
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
          };
        }
      }

      // =========================
      // SENDER_ID SAFE (NUMBER)
      // =========================
      if (sender_id !== undefined && sender_id !== null && sender_id !== "") {
        const senderNum = Number(sender_id);

        if (!isNaN(senderNum)) {
          filter.sender_id = senderNum;
        } else {
          return {
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
          };
        }
      }

      const skip = (page - 1) * limit;

      // =========================
      // QUERY SAFE + LEAN
      // =========================
      const [data, total] = await Promise.all([
        Message.find(filter)
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(), // 🔥 QUAN TRỌNG
        Message.countDocuments(filter),
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

    } catch (err) {
      console.error("🔥 MessageRepository.findAll ERROR:", err);
      throw err;
    }
  }

  static async create(data) {
    try {
      return await Message.create(data);
    } catch (err) {
      console.error("🔥 create MESSAGE ERROR:", err);
      throw err;
    }
  }

  static async update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Message.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).lean();

    } catch (err) {
      console.error("🔥 update MESSAGE ERROR:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Message.findByIdAndDelete(id);

    } catch (err) {
      console.error("🔥 delete MESSAGE ERROR:", err);
      throw err;
    }
  }
}

export default MessageRepository;
