import axiosClient from "./axios.config";

const ShipperLocationService = {
  // Cập nhật vị trí shipper
  updateLocation: (data) => {
    return axiosClient.post("/shipper-locations/update-location", data);
  },

  // Lấy vị trí shipper theo shipment
  getShipmentLocation: (shipment_id) => {
    return axiosClient.get(`/shipper-locations/shipment/${shipment_id}`);
  },
};

export default ShipperLocationService;
