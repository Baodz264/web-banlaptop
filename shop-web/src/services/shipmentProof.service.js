import axiosClient from "./axios.config";

const ShipmentProofService = {
  // Lấy danh sách bằng chứng giao hàng (có thể filter shipment_id, page, limit)
  getShipmentProofs: (params) => {
    return axiosClient.get("/shipment-proofs", { params });
  },

  // Lấy bằng chứng giao hàng theo id
  getShipmentProofById: (id) => {
    return axiosClient.get(`/shipment-proofs/${id}`);
  },

  // Tạo bằng chứng giao hàng (upload ảnh)
  createShipmentProof: (data) => {
    return axiosClient.post("/shipment-proofs", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật bằng chứng giao hàng
  updateShipmentProof: (id, data) => {
    return axiosClient.put(`/shipment-proofs/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa bằng chứng giao hàng
  deleteShipmentProof: (id) => {
    return axiosClient.delete(`/shipment-proofs/${id}`);
  },
};

export default ShipmentProofService;
