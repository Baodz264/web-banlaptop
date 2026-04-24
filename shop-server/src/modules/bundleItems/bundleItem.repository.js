import {
  ProductBundleItem,
  ProductBundle,
  Variant,
  Product
} from "../../database/mysql/index.js";

class ProductBundleItemRepository {

  static baseInclude = [
    {
      model: ProductBundle,
      as: "bundle",
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    {
      model: Variant,
      as: "variant",
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      ]
    }
  ];

  static async findAll() {
    return await ProductBundleItem.findAll({
      include: this.baseInclude
    });
  }

  static async findOne(bundle_id, variant_id) {
    return await ProductBundleItem.findOne({
      where: { bundle_id, variant_id },
      include: this.baseInclude
    });
  }

  static async create(data) {
    return await ProductBundleItem.create(data);
  }

  static async delete(bundle_id, variant_id) {
    return await ProductBundleItem.destroy({
      where: { bundle_id, variant_id }
    });
  }

  static async findByBundle(bundle_id) {
    return await ProductBundleItem.findAll({
      where: { bundle_id },
      include: this.baseInclude
    });
  }
}

export default ProductBundleItemRepository;
