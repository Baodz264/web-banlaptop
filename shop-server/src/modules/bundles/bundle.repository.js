import { Op } from "sequelize";
import Pagination from "../../utils/pagination.js";

import {
  ProductBundle,
  ProductBundleItem,
  Variant,
  Product,          // Thêm import Product
  AttributeValue,   // Thêm import AttributeValue
  Attribute,        // Thêm import Attribute
  Brand,            // Thêm import Brand (nếu muốn hiện hãng)
  Category          // Thêm import Category
} from "../../database/mysql/index.js";

class ProductBundleRepository {

  static bundleInclude = [
    {
      model: ProductBundleItem,
      as: "bundleItems",
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: Variant,
          as: "variant",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          },
          include: [
            // 1. LẤY THÔNG TIN BIẾN THỂ (MÀU, SIZE...)
            {
              model: AttributeValue,
              include: [{ model: Attribute }]
            },
            // 2. LẤY THÔNG TIN SẢN PHẨM (TÊN, THUMBNAIL...)
            {
              model: Product,
              include: [
                { model: Brand },
                { model: Category }
              ]
            }
          ]
        }
      ]
    },
    {
      model: Variant,
      as: "variants",
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      through: {
        attributes: []
      },
      include: [
        // Tương tự cho phần variants tổng của bundle nếu cần
        {
          model: AttributeValue,
          include: [{ model: Attribute }]
        },
        {
          model: Product
        }
      ]
    }
  ];

  static async findById(id) {
    return await ProductBundle.findOne({
      where: { id },
      include: this.bundleInclude
    });
  }

  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      status,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    if (status) {
      where.status = status;
    }

    const data = await ProductBundle.findAndCountAll({
      where,
      include: this.bundleInclude,
      order: [[sort, order]],
      limit,
      offset,
      distinct: true // QUAN TRỌNG: Tránh đếm sai khi include nhiều bảng
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const bundle = await ProductBundle.create(data);
    return await this.findById(bundle.id);
  }

  static async update(id, data) {
    await ProductBundle.update(data, {
      where: { id }
    });
    return await this.findById(id);
  }

  static async delete(id) {
    await ProductBundle.destroy({
      where: { id }
    });
    return true;
  }
}

export default ProductBundleRepository;