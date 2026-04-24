import axiosClient from "./axios.config";

const bannerService = {

  getList: (params) => {
    return axiosClient.get("/banners", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/banners/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/banners", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id, data) => {
    return axiosClient.put(`/banners/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => {
    return axiosClient.delete(`/banners/${id}`);
  },

};

export default bannerService;