import { Op } from "sequelize";

import Inventory from "../../database/mysql/inventory/inventory.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Supplier from "../../database/mysql/inventory/supplier.model.js";
import Product from "../../database/mysql/catalog/product.model.js";

import Pagination from "../../utils/pagination.js";

class InventoryRepository {

  static async findById(id) {
    return await Inventory.findOne({
      where: { id },
      include: [
        {
          model: Variant,
          attributes: { exclude: [] },
          include: [
            {
              model: Product,
              attributes: { exclude: [] }
            }
          ]
        },
        {
          model: Supplier,
          attributes: { exclude: [] }
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      variant_id,
      supplier_id,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    if (variant_id) {
      where.variant_id = variant_id;
    }

    if (supplier_id) {
      where.supplier_id = supplier_id;
    }

    const data = await Inventory.findAndCountAll({
      where,
      include: [
        {
          model: Variant,
          attributes: { exclude: [] },
          include: [
            {
              model: Product,
              attributes: { exclude: [] }
            }
          ]
        },
        {
          model: Supplier,
          attributes: { exclude: [] }
        }
      ],
      order: [[sort, order]],
      limit,
      offset
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const inventory = await Inventory.create(data);
    return await this.findById(inventory.id);
  }

  static async update(id, data) {
    await Inventory.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await Inventory.destroy({
      where: { id }
    });

    return true;
  }
}

export default InventoryRepository;
