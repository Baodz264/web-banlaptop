import axiosClient from "./axios.config";

const ShipmentService = {
  // Lấy danh sách shipment (có thể filter order_id, shipper_id, shipping_status, page...)
  getShipments: (params) => {
    return axiosClient.get("/shipments", { params });
  },

  // Lấy shipment theo id
  getShipmentById: (id) => {
    return axiosClient.get(`/shipments/${id}`);
  },

  // Tạo shipment
  createShipment: (data) => {
    return axiosClient.post("/shipments", data);
  },

  // Cập nhật shipment
  updateShipment: (id, data) => {
    return axiosClient.put(`/shipments/${id}`, data);
  },

  // Xóa shipment
  deleteShipment: (id) => {
    return axiosClient.delete(`/shipments/${id}`);
  },

  // 🔥 Tính phí ship (Shopee style)
  calculateFee: (data) => {
    // data = { from_lat, from_lng, to_lat, to_lng, items?, shipping_type? }
    return axiosClient.post("/shipments/calculate-fee", data);
  },
};

export default ShipmentService;
