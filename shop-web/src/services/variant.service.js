import axiosClient from "./axios.config";

const getAll = () => {
  return axiosClient.get("/variants");
};

const getById = (id) => {
  return axiosClient.get(`/variants/${id}`);
};

const getByProduct = (product_id) => {
  return axiosClient.get(`/variants/product/${product_id}`);
};

// ✅ CREATE (FORM DATA)
const create = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  return axiosClient.post("/variants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ UPDATE (FORM DATA)
const update = (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  return axiosClient.put(`/variants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const remove = (id) => {
  return axiosClient.delete(`/variants/${id}`);
};

// Gán vào biến trước khi export để fix lỗi ESLint
const VariantService = {
  getAll,
  getById,
  getByProduct,
  create,
  update,
  remove,
};

export default VariantService;