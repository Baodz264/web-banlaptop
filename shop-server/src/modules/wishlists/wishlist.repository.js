import Wishlist from "../../database/mysql/review/wishlist.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import Brand from "../../database/mysql/catalog/brand.model.js";
import Category from "../../database/mysql/catalog/category.model.js";
import ProductImage from "../../database/mysql/catalog/productImage.model.js";

class WishlistRepository {

  static async findAllByUser(user_id) {
    return await Wishlist.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Brand,
              attributes: ["id", "name", "slug"]
            },
            {
              model: Category,
              attributes: ["id", "name", "slug"]
            },
            {
              model: ProductImage,
              attributes: ["id", "image"]
            }
          ]
        }
      ]
    });
  }

  static async findOne(user_id, product_id) {
    return await Wishlist.findOne({
      where: { user_id, product_id }
    });
  }

  static async create(data) {
    return await Wishlist.create(data);
  }

  static async delete(user_id, product_id) {
    return await Wishlist.destroy({
      where: { user_id, product_id }
    });
  }

}

export default WishlistRepository;
