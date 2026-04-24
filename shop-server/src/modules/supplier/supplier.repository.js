import { Op } from "sequelize";

import Supplier from "../../database/mysql/inventory/supplier.model.js";
import Inventory from "../../database/mysql/inventory/inventory.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Product from "../../database/mysql/catalog/product.model.js";

import Pagination from "../../utils/pagination.js";

class SupplierRepository {

  static async findById(id) {
    return await Supplier.findOne({
      where: { id },
      include: [
        {
          model: Inventory,
          attributes: [
            "id",
            "variant_id",
            "quantity",
            "cost_price",
            "import_date"
          ],
          include: [
            {
              model: Variant,
              attributes: ["id", "sku", "price"],
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "slug"]
                }
              ]
            }
          ]
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      status,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    if (status) {
      where.status = status;
    }

    const data = await Supplier.findAndCountAll({
      where,
      include: [
        {
          model: Inventory,
          attributes: [
            "id",
            "variant_id",
            "quantity",
            "cost_price"
          ],
          include: [
            {
              model: Variant,
              attributes: ["id", "sku"],
              include: [
                {
                  model: Product,
                  attributes: ["id", "name"]
                }
              ]
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
    const supplier = await Supplier.create(data);
    return await this.findById(supplier.id);
  }

  static async update(id, data) {

    await Supplier.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Supplier.destroy({
      where: { id }
    });

    return true;
  }
}

export default SupplierRepository;
