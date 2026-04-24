import { Op } from "sequelize";
import Setting from "../../database/mysql/cms/setting.model.js";
import Pagination from "../../utils/pagination.js";

class SettingRepository {

  static async findById(id) {
    return await Setting.findOne({
      where: { id }
    });
  }

  static async findByKey(key) {
    return await Setting.findOne({
      where: { key }
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { search, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where.key = {
        [Op.like]: `%${search}%`,
      };
    }

    const data = await Setting.findAndCountAll({
      where,
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await Setting.create(data);
  }

  static async update(id, data) {

    await Setting.update(data, {
      where: { id },
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Setting.destroy({
      where: { id },
    });

    return true;
  }
}

export default SettingRepository;
