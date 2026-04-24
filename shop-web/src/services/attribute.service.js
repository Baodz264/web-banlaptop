import axiosClient from "./axios.config";

const getAll = () => {
  return axiosClient.get("/attributes");
};

const getById = (id) => {
  return axiosClient.get(`/attributes/${id}`);
};

const create = (data) => {
  return axiosClient.post("/attributes", data);
};

const update = (id, data) => {
  return axiosClient.put(`/attributes/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/attributes/${id}`);
};


const attributeService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default attributeService;