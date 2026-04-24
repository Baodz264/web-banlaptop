import ChatRepository from "./chat.repository.js";

class ChatService {

  static async getChats(query) {
    return await ChatRepository.findAll(query);
  }

  static async getChatById(id) {

    const chat = await ChatRepository.findById(id);

    if (!chat) {
      throw new Error("Không tìm thấy cuộc trò chuyện");
    }

    return chat;
  }

  static async createChat(data) {

    const exist = await ChatRepository.findByUsers(
      data.customer_id,
      data.admin_id
    );

    if (exist) {
      return exist;
    }

    return await ChatRepository.create(data);
  }

  static async updateLastMessage(chat_id) {

    const chat = await ChatRepository.findById(chat_id);

    if (!chat) {
      throw new Error("Không tìm thấy cuộc trò chuyện");
    }

    return await ChatRepository.updateLastMessage(chat_id);
  }

  static async deleteChat(id) {

    const chat = await ChatRepository.findById(id);

    if (!chat) {
      throw new Error("Không tìm thấy cuộc trò chuyện");
    }

    return await ChatRepository.delete(id);
  }
}

export default ChatService;
