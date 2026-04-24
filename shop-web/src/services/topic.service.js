import axiosClient from "./axios.config";

const topicService = {

  // LIST
  getTopics(params) {
    return axiosClient.get("/topics", { params });
  },

  // DETAIL
  getTopicById(id) {
    return axiosClient.get(`/topics/${id}`);
  },

  // CREATE
  createTopic(data) {
    return axiosClient.post("/topics", data);
  },

  // UPDATE
  updateTopic(id, data) {
    return axiosClient.put(`/topics/${id}`, data);
  },

  // DELETE
  deleteTopic(id) {
    return axiosClient.delete(`/topics/${id}`);
  }

};

export default topicService;