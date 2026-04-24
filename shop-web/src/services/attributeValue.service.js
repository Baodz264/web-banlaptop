import axiosClient from "./axios.config";

const getAll = () => {
  return axiosClient.get("/attribute-values");
};

const getByAttribute = (attribute_id) => {
  return axiosClient.get(`/attribute-values/attribute/${attribute_id}`);
};

const create = (data) => {
  return axiosClient.post("/attribute-values", data);
};

const update = (id, data) => {
  return axiosClient.put(`/attribute-values/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/attribute-values/${id}`);
};

// Đặt tên cho object trước khi export
const attributeValueService = {
  getAll,
  getByAttribute,
  create,
  update,
  remove,
};

export default attributeValueService;