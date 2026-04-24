import { Op } from "sequelize";
import Menu from "../../database/mysql/cms/menu.model.js";
import Pagination from "../../utils/pagination.js";

class MenuRepository {

  static async findById(id) {
    return await Menu.findOne({
      where: { id },
      include: [
        {
          model: Menu,
          as: "parent",
          attributes: ["id", "name", "link", "position"]
        },
        {
          model: Menu,
          as: "children",
          attributes: ["id", "name", "link", "position", "status"]
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { search, status, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    // sửa lỗi status
    if (status !== undefined) {
      where.status = status;
    }

    const data = await Menu.findAndCountAll({
      where,
      include: [
        {
          model: Menu,
          as: "parent",
          attributes: ["id", "name", "link"]
        }
      ],
      order: [[sort, order]],
      limit,
      offset
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await Menu.create(data);
  }

  static async update(id, data) {

    await Menu.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Menu.destroy({
      where: { id }
    });

    return true;
  }
}

export default MenuRepository;
