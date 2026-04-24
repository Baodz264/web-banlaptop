import { Op } from "sequelize";
import InventoryLog from "../../database/mysql/inventory/inventoryLog.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Product from "../../database/mysql/catalog/product.model.js";

import Pagination from "../../utils/pagination.js";

class InventoryLogRepository {

  static async findById(id) {
    return await InventoryLog.findOne({
      where: { id },
      include: [
        {
          model: Variant,
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: Product,
              attributes: ["id", "name", "slug"]
            }
          ]
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      variant_id,
      type,
      sort = "created_at",
      order = "DESC"
    } = query;

    const where = {};

    if (variant_id) {
      where.variant_id = variant_id;
    }

    if (type) {
      where.type = type;
    }

    const data = await InventoryLog.findAndCountAll({
      where,
      include: [
        {
          model: Variant,
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: Product,
              attributes: ["id", "name", "slug"]
            }
          ]
        }
      ],
      order: [[sort, order]],
      limit,
      offset
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await InventoryLog.create(data);
  }

}

export default InventoryLogRepository;
