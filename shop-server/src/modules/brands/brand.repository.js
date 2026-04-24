import { Op } from "sequelize";
import Pagination from "../../utils/pagination.js";

import {
  Brand,
  Product
} from "../../database/mysql/index.js";

class BrandRepository {

  static brandInclude = [
    {
      model: Product,
      attributes: [
        "id",
        "name",
        "slug",
        "thumbnail",
        "status",
        "created_at"
      ]
    }
  ];

  static async findById(id) {
    return await Brand.findByPk(id, {
      include: this.brandInclude
    });
  }

  static async findBySlug(slug) {
    return await Brand.findOne({
      where: { slug }
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const { search, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    const data = await Brand.findAndCountAll({
      where,
      include: this.brandInclude,
      order: [[sort, order]],
      limit,
      offset,
      distinct: true
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {

    const brand = await Brand.create(data);

    return await this.findById(brand.id);
  }

  static async update(id, data) {

    await Brand.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Brand.destroy({
      where: { id }
    });

    return true;
  }
}

export default BrandRepository;
