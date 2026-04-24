import axiosClient from "./axios.config";


const productSpecificationService = {

  getByProduct(product_id){
    return axiosClient.get(`/product-specifications/product/${product_id}`);
  },

  getById(id){
    return axiosClient.get(`/product-specifications/${id}`);
  },

  create(data){
    return axiosClient.post("/product-specifications", data);
  },

  update(id,data){
    return axiosClient.put(`/product-specifications/${id}`, data);
  },

  delete(id){
    return axiosClient.delete(`/product-specifications/${id}`);
  }

};

export default productSpecificationService;
