import axiosClient from "./axios.config";

const AddressService = {

  
  createAddress(data) {
    return axiosClient.post("/addresses", data, {
      timeout: 20000, 
    });
  },

  getAddresses() {
    return axiosClient.get("/addresses");
  },

  getAllAddresses() {
    return axiosClient.get("/addresses/admin/all");
  },

  getAddressById(id) {
    return axiosClient.get(`/addresses/${id}`);
  },

  updateAddress(id, data) {
    return axiosClient.put(`/addresses/${id}`, data, {
      timeout: 20000, 
    });
  },

  deleteAddress(id) {
    return axiosClient.delete(`/addresses/${id}`);
  }

};

export default AddressService;
