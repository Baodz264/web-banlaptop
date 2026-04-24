import axiosClient from "./axios.config";

const aiChatService = {
  sendMessage: async (message) => {
    try {
      const res = await axiosClient.post("/ai/chat", {
        message,
      });

      return res.data;
    } catch (error) {
      console.error("AI Chat Error:", error);
      throw error;
    }
  },
};

export default aiChatService;
