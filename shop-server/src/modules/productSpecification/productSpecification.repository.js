import {
  ProductSpecification,
  Product
} from "../../database/mysql/index.js";

class ProductSpecificationRepository {

  static async findByProduct(product_id) {
    return await ProductSpecification.findAll({
      where: { product_id },

      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ],

      order: [["sort_order", "ASC"]]
    });
  }

  static async findById(id) {
    return await ProductSpecification.findOne({
      where: { id },

      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ]
    });
  }

  static async create(data) {
    return await ProductSpecification.create(data);
  }

  static async update(id, data) {
    await ProductSpecification.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await ProductSpecification.destroy({
      where: { id }
    });

    return true;
  }

}

export default ProductSpecificationRepository;
