import { Op } from "sequelize";
import PostImage from "../../database/mysql/cms/postImage.model.js";
import Post from "../../database/mysql/cms/post.model.js";
import Pagination from "../../utils/pagination.js";

class PostImageRepository {

  static async findById(id) {
    return await PostImage.findOne({
      where: { id },
      include: [
        {
          model: Post,
          attributes: ["id", "title", "slug", "status"],
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);
    const { post_id, sort = "id", order = "DESC" } = query;

    const where = {};

    if (post_id) {
      where.post_id = post_id;
    }

    const data = await PostImage.findAndCountAll({
      where,
      include: [
        {
          model: Post,
          attributes: ["id", "title", "slug", "status"],
        }
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await PostImage.create(data);
  }

  static async update(id, data) {

    await PostImage.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await PostImage.destroy({
      where: { id }
    });

    return true;
  }
}

export default PostImageRepository;
