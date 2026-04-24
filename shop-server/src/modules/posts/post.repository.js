import { Op } from "sequelize";
import {
  Post,
  Topic,
  User,
  PostImage,
  Product
} from "../../database/mysql/index.js";

import Pagination from "../../utils/pagination.js";

class PostRepository {

  static async findById(id) {
    return await Post.findOne({
      where: { id },
      include: [
        { model: Topic },
        {
          model: User,
          as: "Author",
          attributes: { exclude: ["password", "refresh_token"] }
        },
        { model: PostImage },
        { model: Product, through: { attributes: [] } }
      ]
    });
  }

  // ⭐ thêm
  static async findBySlug(slug) {
    return await Post.findOne({
      where: { slug },
      include: [
        { model: Topic },
        {
          model: User,
          as: "Author",
          attributes: { exclude: ["password", "refresh_token"] }
        },
        { model: PostImage },
        { model: Product, through: { attributes: [] } }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { search, status, topic_id, sort = "id", order = "DESC" } = query;

    const where = {};

    if (search) {
      where.title = {
        [Op.like]: `%${search}%`
      };
    }

    if (status) {
      where.status = status;
    }

    if (topic_id) {
      where.topic_id = topic_id;
    }

    const data = await Post.findAndCountAll({
      where,
      include: [
        { model: Topic },
        {
          model: User,
          as: "Author",
          attributes: { exclude: ["password", "refresh_token"] }
        },
        { model: PostImage },
        { model: Product, through: { attributes: [] } }
      ],
      order: [[sort, order]],
      limit,
      offset,
      distinct: true
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await Post.create(data);
  }

  static async update(id, data) {

    await Post.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await Post.destroy({
      where: { id }
    });

    return true;
  }
}

export default PostRepository;
