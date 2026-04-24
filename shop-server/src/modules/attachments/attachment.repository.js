import Attachment from "../../database/mongo/chat/attachment.schema.js";
import mongoose from "mongoose";

class AttachmentRepository {

  static async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;

      return await Attachment.findById(id).lean();

    } catch (err) {
      console.error("🔥 AttachmentRepository.findById ERROR:", err);
      return null;
    }
  }

  static async findByMessage(message_id) {
    try {
      if (!message_id) return [];

      // =========================
      // SAFE OBJECTID HANDLING
      // =========================
      let filter = {};

      if (mongoose.Types.ObjectId.isValid(message_id)) {
        filter.message_id = new mongoose.Types.ObjectId(message_id);
      } else {
        // nếu sai format → không crash server
        return [];
      }

      return await Attachment.find(filter).lean();

    } catch (err) {
      console.error("🔥 AttachmentRepository.findByMessage ERROR:", err);
      return [];
    }
  }

  static async create(data) {
    try {
      return await Attachment.create(data);
    } catch (err) {
      console.error("🔥 AttachmentRepository.create ERROR:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;

      return await Attachment.findByIdAndDelete(id);

    } catch (err) {
      console.error("🔥 AttachmentRepository.delete ERROR:", err);
      return null;
    }
  }
}

export default AttachmentRepository;
