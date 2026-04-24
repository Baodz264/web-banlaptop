import axiosClient from "./axios.config";

const variantValueService = {
  getByVariantId: (variant_id) => {
    return axiosClient.get(`/variant-values/variant/${variant_id}`);
  },

  create: (data) => {
    return axiosClient.post("/variant-values", data);
  },

  createMany: (data) => {
    return axiosClient.post("/variant-values/bulk", data);
  },

  removeByVariant: (variant_id) => {
    return axiosClient.delete(`/variant-values/variant/${variant_id}`);
  }
};

// Xuất mặc định để file khác có thể import variantValueService từ ...
export default variantValueService;