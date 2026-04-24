import Chat from "../../database/mongo/chat/chat.schema.js";

class ChatRepository {

  static async findAll(query = {}) {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (query.customer_id) {
      filter.customer_id = query.customer_id;
    }

    if (query.admin_id) {
      filter.admin_id = query.admin_id;
    }

    const data = await Chat.find(filter)
      .sort({ last_message_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments(filter);

    return {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id) {
    return await Chat.findById(id);
  }

  static async findByUsers(customer_id, admin_id) {
    return await Chat.findOne({
      customer_id,
      admin_id
    });
  }

  static async create(data) {
    return await Chat.create(data);
  }

  static async updateLastMessage(id) {

    return await Chat.findByIdAndUpdate(
      id,
      { last_message_at: new Date() },
      { new: true }
    );
  }

  static async delete(id) {
    return await Chat.findByIdAndDelete(id);
  }
}

export default ChatRepository;
