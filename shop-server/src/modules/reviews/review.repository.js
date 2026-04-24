import Review from "../../database/mysql/review/review.model.js";
import User from "../../database/mysql/user/user.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import ReviewImage from "../../database/mysql/review/reviewImage.model.js";

import Pagination from "../../utils/pagination.js";
import { Op, fn, col } from "sequelize";

class ReviewRepository {

  static async findById(id) {
    const review = await Review.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Product,
          attributes: ["id", "name", "slug", "thumbnail"],
        },
        {
          model: ReviewImage,
        },
        {
          model: Review,
          as: "Replies",
          include: [
            {
              model: User,
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
    });

    return review || null;
  }

  static async findOne(where) {
    return await Review.findOne({ where });
  }

  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const { product_id, user_id, rating, keyword } = query;

    const where = {};

    // ===== FILTER =====
    if (product_id) where.product_id = product_id;
    if (user_id) where.user_id = user_id;

    if (rating) {
      if (Array.isArray(rating)) {
        where.rating = { [Op.in]: rating };
      } else if (typeof rating === "string" && rating.includes(",")) {
        where.rating = { [Op.in]: rating.split(",").map(Number) };
      } else {
        where.rating = rating;
      }
    }

    // chỉ lấy review cha
    where.parent_id = null;

    // ===== SEARCH =====
    if (keyword) {
      where[Op.or] = [
        { comment: { [Op.like]: `%${keyword}%` } },
        { "$User.name$": { [Op.like]: `%${keyword}%` } },
        { "$Product.name$": { [Op.like]: `%${keyword}%` } },
      ];
    }

    const data = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Product,
          attributes: ["id", "name", "slug", "thumbnail"],
        },
        {
          model: ReviewImage,
        },
        {
          model: Review,
          as: "Replies",
          include: [
            {
              model: User,
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
      subQuery: false, // 🔥 bắt buộc để search join
      distinct: true, // 🔥 fix count khi include
    });

    const items = data.rows.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      user_id: r.user_id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      updated_at: r.updated_at,

      product: r.Product || null,
      user: r.User || null,
      images: r.ReviewImages || [],
      replies: r.Replies || [],
    }));

    return {
      totalItems: data.count,
      items,
      totalPages: Math.ceil(data.count / limit),
      currentPage: page,
    };
  }

  static async getRatingSummary(product_id) {
    const result = await Review.findAll({
      where: {
        product_id,
        parent_id: null,
      },
      attributes: ["rating", [fn("COUNT", col("rating")), "count"]],
      group: ["rating"],
      raw: true,
    });

    const summary = {
      average: 0,
      total: 0,
      detail: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    let totalScore = 0;
    let totalCount = 0;

    result.forEach((item) => {
      const rating = item.rating;
      const count = parseInt(item.count);

      summary.detail[rating] = count;
      totalScore += rating * count;
      totalCount += count;
    });

    summary.total = totalCount;
    summary.average = totalCount ? (totalScore / totalCount).toFixed(1) : 0;

    return summary;
  }

  static async create(data) {
    const review = await Review.create(data);
    return await this.findById(review.id);
  }

  static async update(id, data) {
    await Review.update(data, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id) {
    await Review.destroy({ where: { id } });
    return true;
  }
}

export default ReviewRepository;
