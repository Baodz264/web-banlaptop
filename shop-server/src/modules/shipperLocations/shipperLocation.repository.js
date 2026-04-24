import ShipperLocation from "../../database/mysql/shipment/ShipperLocation.model.js";
import User from "../../database/mysql/user/user.model.js";
import Shipment from "../../database/mysql/shipment/shipment.model.js";

class ShipperLocationRepository {

  static baseInclude = [
    {
      model: User,
      as: "Shipper",
      required: false,
      attributes: {
        exclude: ["password", "refresh_token"]
      }
    },
    {
      model: Shipment,
      required: false,
    }
  ];

  // ✅ lấy vị trí mới nhất theo shipment
  static async findLatestByShipment(shipment_id) {

    return await ShipperLocation.findOne({
      where: { shipment_id },
      include: this.baseInclude,
      order: [["updated_at", "DESC"]],
    });

  }

  // ✅ lấy vị trí mới nhất của shipper (khi chưa có shipment)
  static async findLatestByShipper(shipper_id) {

    return await ShipperLocation.findOne({
      where: { shipper_id },
      include: this.baseInclude,
      order: [["updated_at", "DESC"]],
    });

  }

  static async create(data) {
    return await ShipperLocation.create(data);
  }

}

export default ShipperLocationRepository;
