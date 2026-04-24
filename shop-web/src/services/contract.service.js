import axiosClient from "./axios.config";

const ContractService = {

  // Lấy danh sách contract (search, pagination, filter)
  getContracts: (params) => {
    return axiosClient.get("/contracts", { params });
  },

  // Lấy contract theo id
  getContractById: (id) => {
    return axiosClient.get(`/contracts/${id}`);
  },

  // Tạo contract
  createContract: (data) => {

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("supplier_id", data.supplier_id);

    if (data.file) {
      formData.append("file", data.file);
    }

    return axiosClient.post("/contracts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật contract
  updateContract: (id, data) => {

    const formData = new FormData();

    if (data.title) {
      formData.append("title", data.title);
    }

    if (data.status) {
      formData.append("status", data.status);
    }

    if (data.file) {
      formData.append("file", data.file);
    }

    return axiosClient.put(`/contracts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa contract
  deleteContract: (id) => {
    return axiosClient.delete(`/contracts/${id}`);
  }

};

export default ContractService;
