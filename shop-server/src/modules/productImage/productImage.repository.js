import ProductImage from "../../database/mysql/catalog/productImage.model.js";

class ProductImageRepository {

  static async findAllByProduct(product_id) {
    return await ProductImage.findAll({
      where: { product_id }
    });
  }

  static async findById(id) {
    return await ProductImage.findOne({
      where: { id }
    });
  }

  static async create(data) {
    return await ProductImage.create(data);
  }

  static async delete(id) {
    await ProductImage.destroy({
      where: { id }
    });

    return true;
  }

  static async deleteByProduct(product_id) {
    await ProductImage.destroy({
      where: { product_id }
    });

    return true;
  }

}

export default ProductImageRepository;
