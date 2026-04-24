import axiosClient from "./axios.config";

const settingService = {

  getSettings(params) {
    return axiosClient.get("/settings", { params });
  },

  getSettingById(id) {
    return axiosClient.get(`/settings/${id}`);
  },

  createSetting(data) {
    return axiosClient.post("/settings", data);
  },

  updateSetting(id, data) {
    return axiosClient.put(`/settings/${id}`, data);
  },

  deleteSetting(id) {
    return axiosClient.delete(`/settings/${id}`);
  }

};

export default settingService;