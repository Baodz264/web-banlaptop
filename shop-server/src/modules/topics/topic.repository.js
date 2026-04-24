import { Op } from "sequelize";
import Topic from "../../database/mysql/cms/topic.model.js";
import Post from "../../database/mysql/cms/post.model.js";
import Pagination from "../../utils/pagination.js";

class TopicRepository {

  static async findById(id) {
    return await Topic.findOne({
      where: { id },
      include: [
        {
          model: Post,
          where: { status: 1 },
          required: false,
          attributes: [
            "id",
            "title",
            "slug",
            "status",
            "created_at"
          ]
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { search, status, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    const data = await Topic.findAndCountAll({
      where,
      include: [
        {
          model: Post,
          where: { status: 1 },
          required: false,
          attributes: [
            "id",
            "title",
            "slug",
            "status",
            "created_at"
          ]
        }
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await Topic.create(data);
  }

  static async update(id, data) {

    await Topic.update(data, {
      where: { id },
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await Topic.destroy({
      where: { id },
    });

    return true;
  }
}

export default TopicRepository;
