import { Op } from "sequelize";

import PromotionItem from "../../database/mysql/promotion/promotionItem.model.js";

import Promotion from "../../database/mysql/promotion/promotion.model.js";
import Category from "../../database/mysql/catalog/category.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Brand from "../../database/mysql/catalog/brand.model.js";

class PromotionItemRepository {

  static async findAll(query) {

    const { promotion_id, apply_type } = query;

    const where = {};

    if (promotion_id) {
      where.promotion_id = promotion_id;
    }

    if (apply_type) {
      where.apply_type = apply_type;
    }

    return await PromotionItem.findAll({
      where,
      include: [
        {
          model: Promotion
        },
        {
          model: Category
        },
        {
          model: Product
        },
        {
          model: Variant
        },
        {
          model: Brand
        }
      ]
    });
  }

  static async findById(id) {
    return await PromotionItem.findByPk(id, {
      include: [
        {
          model: Promotion
        },
        {
          model: Category
        },
        {
          model: Product
        },
        {
          model: Variant
        },
        {
          model: Brand
        }
      ]
    });
  }

  static async create(data) {
    return await PromotionItem.create(data);
  }

  static async update(id, data) {

    await PromotionItem.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await PromotionItem.destroy({
      where: { id }
    });

    return true;
  }
}

export default PromotionItemRepository;
