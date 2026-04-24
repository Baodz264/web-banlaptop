import axiosClient from "./axios.config";

const menuService = {

  getMenus(params) {
    return axiosClient.get("/menus", { params });
  },

  getMenuById(id) {
    return axiosClient.get(`/menus/${id}`);
  },

  createMenu(data) {
    return axiosClient.post("/menus", data);
  },

  updateMenu(id, data) {
    return axiosClient.put(`/menus/${id}`, data);
  },

  deleteMenu(id) {
    return axiosClient.delete(`/menus/${id}`);
  }

};

export default menuService;