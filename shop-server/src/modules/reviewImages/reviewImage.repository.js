import ReviewImage from "../../database/mysql/review/reviewImage.model.js";
import Review from "../../database/mysql/review/review.model.js";
import User from "../../database/mysql/user/user.model.js";
import Product from "../../database/mysql/catalog/product.model.js";

class ReviewImageRepository {

  static async findById(id) {
    return await ReviewImage.findByPk(id, {
      include: [
        {
          model: Review,
          attributes: { exclude: [] },
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password", "refresh_token"]
              }
            },
            {
              model: Product
            }
          ]
        }
      ]
    });
  }

  static async findByReviewId(review_id) {
    return await ReviewImage.findAll({
      where: { review_id },
      include: [
        {
          model: Review,
          attributes: { exclude: [] },
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password", "refresh_token"]
              }
            },
            {
              model: Product
            }
          ]
        }
      ]
    });
  }

  static async create(data) {
    return await ReviewImage.create(data);
  }

  static async delete(id) {
    return await ReviewImage.destroy({
      where: { id }
    });
  }
}

export default ReviewImageRepository;
