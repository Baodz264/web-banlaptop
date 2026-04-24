import axiosClient from "./axios.config";

const BrandService = {

  
  getBrands(params) {
    return axiosClient.get("/brands", { params });
  },

  getBrandById(id) {
    return axiosClient.get(`/brands/${id}`);
  },

  createBrand(data) {
    return axiosClient.post("/brands", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateBrand(id, data) {
    return axiosClient.put(`/brands/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteBrand(id) {
    return axiosClient.delete(`/brands/${id}`);
  }

};

export default BrandService;