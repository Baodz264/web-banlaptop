import { Op } from "sequelize";
import PostProduct from "../../database/mysql/cms/postProduct.model.js";
import Post from "../../database/mysql/cms/post.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import Pagination from "../../utils/pagination.js";

class PostProductRepository {
  static async findOne(post_id, product_id) {
    return await PostProduct.findOne({
      where: {
        post_id,
        product_id,
      },
      include: [
        {
          model: Post,
          as: "Post",
        },
        {
          model: Product,
          as: "Product",
        },
      ],
    });
  }

  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const { post_id, product_id, sort = "post_id", order = "DESC" } = query;

    const where = {};

    if (post_id) {
      where.post_id = post_id;
    }

    if (product_id) {
      where.product_id = product_id;
    }

    const data = await PostProduct.findAndCountAll({
      where,
      include: [
        {
          model: Post,
          as: "Post",
        },
        {
          model: Product,
          as: "Product",
        },
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    return await PostProduct.create(data);
  }

  static async delete(post_id, product_id) {
    await PostProduct.destroy({
      where: {
        post_id,
        product_id,
      },
    });

    return true;
  }
}

export default PostProductRepository;
