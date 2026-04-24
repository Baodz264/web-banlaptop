import { Op } from "sequelize";

import VoucherApply from "../../database/mysql/voucher/voucherApply.model.js";

import Voucher from "../../database/mysql/voucher/voucher.model.js";
import Category from "../../database/mysql/catalog/category.model.js";
import Product from "../../database/mysql/catalog/product.model.js";

class VoucherApplyRepository {
  static async findById(id) {
    return await VoucherApply.findByPk(id, {
      include: [
        {
          model: Voucher,
        },
        {
          model: Category,
        },
        {
          model: Product,
        },
      ],
    });
  }

  static async findAll(query) {
    const { voucher_id, apply_type, category_id, product_id } = query;

    const where = {};

    if (voucher_id) where.voucher_id = voucher_id;
    if (apply_type) where.apply_type = apply_type;
    if (category_id) where.category_id = category_id;
    if (product_id) where.product_id = product_id;

    return await VoucherApply.findAll({
      where,
      include: [
        {
          model: Voucher,
        },
        {
          model: Category,
        },
        {
          model: Product,
        },
      ],
    });
  }

  static async create(data) {
    return await VoucherApply.create(data);
  }

  static async update(id, data) {
    await VoucherApply.update(data, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id) {
    await VoucherApply.destroy({ where: { id } });
    return true;
  }
}

export default VoucherApplyRepository;
