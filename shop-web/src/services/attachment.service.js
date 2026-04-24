import axiosClient from "./axios.config";

const AttachmentService = {

  getAttachments: (message_id) => {
    return axiosClient.get("/attachments", {
      params: { message_id }
    });
  },

  getAttachmentById: (id) => {
    return axiosClient.get(`/attachments/${id}`);
  },

  
  createAttachment: (formData) => {
    return axiosClient.post("/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteAttachment: (id) => {
    return axiosClient.delete(`/attachments/${id}`);
  }

};

export default AttachmentService;
