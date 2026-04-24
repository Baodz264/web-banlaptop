import axiosClient from "./axios.config";

const MessageService = {

  // Lấy danh sách tin nhắn (chat_id, sender_id, pagination)
  getMessages: (params) => {
    return axiosClient.get("/messages", { params });
  },

  // Lấy tin nhắn theo id
  getMessageById: (id) => {
    return axiosClient.get(`/messages/${id}`);
  },

  // Tạo tin nhắn
  createMessage: (data) => {
    return axiosClient.post("/messages", data);
  },

  // Cập nhật tin nhắn
  updateMessage: (id, data) => {
    return axiosClient.put(`/messages/${id}`, data);
  },

  // Xóa tin nhắn
  deleteMessage: (id) => {
    return axiosClient.delete(`/messages/${id}`);
  }

};

export default MessageService;
