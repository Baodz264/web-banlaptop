import {
  Variant,
  Product,
  AttributeValue,
  Attribute,
  Inventory,
  Supplier,
  ProductBundle,
} from "../../database/mysql/index.js";

import { Op } from "sequelize";

class VariantRepository {
  static baseInclude = [
    {
      model: Product,
      attributes: ["id", "name", "slug"],
    },
    {
      model: AttributeValue,
      attributes: ["id", "value"],
      through: { attributes: [] },
      include: [
        {
          model: Attribute,
          attributes: ["id", "name"],
        },
      ],
    },
    {
      model: Inventory,
      attributes: ["id", "quantity"],
      required: false, // ✅ tránh lỗi khi không có inventory
      include: [
        {
          model: Supplier,
          attributes: ["id", "name"],
        },
      ],
    },
    {
      model: ProductBundle,
      as: "bundles",
      attributes: ["id", "name"],
      through: { attributes: [] },
    },
  ];

  // ✅ FILTER
  static async findAll(filter = {}) {
    const where = {};

    if (filter.product_id) {
      where.product_id = filter.product_id;
    }

    if (filter.minPrice || filter.maxPrice) {
      where.price = {};

      if (filter.minPrice) {
        where.price[Op.gte] = filter.minPrice;
      }

      if (filter.maxPrice) {
        where.price[Op.lte] = filter.maxPrice;
      }
    }

    return await Variant.findAll({
      where,
      include: this.baseInclude,
      order: [["id", "ASC"]],
    });
  }

  static async findAllByProduct(productId) {
    return await Variant.findAll({
      where: { product_id: productId },
      include: this.baseInclude,
      order: [["id", "ASC"]],
    });
  }

  static async findById(id) {
    return await Variant.findOne({
      where: { id },
      include: this.baseInclude,
    });
  }

  static async create(data) {
    return await Variant.create(data);
  }

  static async update(id, data) {
    await Variant.update(data, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id) {
    await Variant.destroy({ where: { id } });
    return true;
  }
}

export default VariantRepository;
