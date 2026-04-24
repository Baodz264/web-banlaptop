import Shipment from "../../database/mysql/shipment/shipment.model.js";
import ShipperLocationRepository from "./shipperLocation.repository.js";

class ShipperLocationService {

  // ✅ VALIDATE
  static validate(data) {

    if (!data.shipper_id) {
      throw new Error("Thiếu shipper_id");
    }

    if (!data.latitude || !data.longitude) {
      throw new Error("Thiếu tọa độ");
    }

    const lat = Number(data.latitude);
    const lng = Number(data.longitude);

    if (lat < -90 || lat > 90) {
      throw new Error("Latitude không hợp lệ");
    }

    if (lng < -180 || lng > 180) {
      throw new Error("Longitude không hợp lệ");
    }
  }

  // ✅ UPDATE LOCATION (REALTIME)
  static async updateLocation(data) {

    this.validate(data);

    // ❗ shipment_id có thể null → chỉ check khi có
    if (data.shipment_id) {
      const shipment = await Shipment.findByPk(data.shipment_id);

      if (!shipment) {
        throw new Error("Shipment không tồn tại");
      }
    }

    // default
    data.is_active = data.is_active ?? 1;

    return await ShipperLocationRepository.create(data);
  }

  // ✅ LẤY VỊ TRÍ SHIPMENT
  static async getShipmentLocation(shipment_id) {

    const location =
      await ShipperLocationRepository.findLatestByShipment(shipment_id);

    if (!location) {
      throw new Error("Không tìm thấy vị trí shipper");
    }

    return location;
  }

  // ✅ (OPTIONAL) lấy vị trí shipper khi chưa nhận đơn
  static async getShipperLocation(shipper_id) {

    const location =
      await ShipperLocationRepository.findLatestByShipper(shipper_id);

    if (!location) {
      throw new Error("Không tìm thấy vị trí shipper");
    }

    return location;
  }

}

export default ShipperLocationService;
