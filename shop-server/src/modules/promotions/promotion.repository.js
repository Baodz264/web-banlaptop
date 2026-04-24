import { Op } from "sequelize";
import Promotion from "../../database/mysql/promotion/promotion.model.js";
import PromotionItem from "../../database/mysql/promotion/promotionItem.model.js";

import Category from "../../database/mysql/catalog/category.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Brand from "../../database/mysql/catalog/brand.model.js";

import Pagination from "../../utils/pagination.js";

class PromotionRepository {

  static includeRelations() {
    return [
      {
        model: PromotionItem,
        include: [
          {
            model: Category,
          },
          {
            model: Product,
          },
          {
            model: Variant,
          },
          {
            model: Brand,
          },
        ],
      },
    ];
  }

  static async findById(id) {
    return await Promotion.findByPk(id, {
      include: this.includeRelations(),
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

    const data = await Promotion.findAndCountAll({
      where,
      include: this.includeRelations(),
      limit,
      offset,
      order: [[sort, order]]
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const promotion = await Promotion.create(data);
    return await this.findById(promotion.id);
  }

  static async update(id, data) {

    await Promotion.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Promotion.destroy({
      where: { id }
    });

    return true;
  }

}

export default PromotionRepository;
