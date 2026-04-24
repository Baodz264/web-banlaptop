import axiosClient from "./axios.config";

class ChatService {

  // lấy danh sách chat
  getChats(params = {}) {
    return axiosClient.get("/chats", { params });
  }

  // lấy chat theo id
  getChatById(id) {
    return axiosClient.get(`/chats/${id}`);
  }

  // tạo chat
  createChat(data) {
    return axiosClient.post("/chats", data);
  }

  // update last message
  updateLastMessage(id) {
    return axiosClient.put(`/chats/${id}/last-message`);
  }

  // xoá chat
  deleteChat(id) {
    return axiosClient.delete(`/chats/${id}`);
  }
}

const chatService = new ChatService();
export default chatService;
