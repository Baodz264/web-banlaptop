import { Op } from "sequelize";
import Banner from "../../database/mysql/cms/banner.model.js";
import Pagination from "../../utils/pagination.js";

class BannerRepository {

  static async findById(id) {
    return await Banner.findOne({
      where: { id }
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { search, status, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }

    if (status) {
      where.status = status;
    }

    const data = await Banner.findAndCountAll({
      where,
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await Banner.create(data);
  }

  static async update(id, data) {

    await Banner.update(data, {
      where: { id },
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await Banner.destroy({
      where: { id },
    });

    return true;
  }
}

export default BannerRepository;
