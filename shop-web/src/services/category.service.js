import axiosClient from "./axios.config";

const categoryService = {

  getCategories(params) {
    return axiosClient.get("/categories", { params });
  },

  getCategoryById(id) {
    return axiosClient.get(`/categories/${id}`);
  },

  createCategory(data) {
    return axiosClient.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCategory(id, data) {
    return axiosClient.put(`/categories/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCategory(id) {
    return axiosClient.delete(`/categories/${id}`);
  }

};

export default categoryService;