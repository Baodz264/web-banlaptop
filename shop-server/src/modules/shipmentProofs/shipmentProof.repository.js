import ShipmentProof from "../../database/mysql/shipment/shipmentProof.model.js";
import Shipment from "../../database/mysql/shipment/shipment.model.js";
import Order from "../../database/mysql/order/order.model.js";
import User from "../../database/mysql/user/user.model.js";

import Pagination from "../../utils/pagination.js";

class ShipmentProofRepository {

  static baseInclude = [
    {
      model: Shipment,
      include: [
        {
          model: Order,
        },
        {
          model: User,
          as: "Shipper",
          required: false, // ✅ tránh lỗi nếu chưa có shipper
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
      ],
    },
  ];

  static async findById(id) {
    return await ShipmentProof.findOne({
      where: { id },
      include: this.baseInclude,
    });
  }

  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const { shipment_id, type } = query;

    const where = {};

    if (shipment_id) {
      where.shipment_id = shipment_id;
    }

    if (type) {
      where.type = type; // pickup | delivery
    }

    const data = await ShipmentProof.findAndCountAll({
      where,
      include: this.baseInclude,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const proof = await ShipmentProof.create(data);
    return await this.findById(proof.id);
  }

  static async update(id, data) {
    await ShipmentProof.update(data, {
      where: { id },
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await ShipmentProof.destroy({
      where: { id },
    });

    return true;
  }
}

export default ShipmentProofRepository;
