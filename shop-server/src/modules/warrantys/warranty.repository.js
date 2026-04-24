import { Op } from "sequelize";
import Warranty from "../../database/mysql/contract/warranty.model.js";
import { Variant, Product } from "../../database/mysql/index.js";
import Pagination from "../../utils/pagination.js";

class WarrantyRepository {

  /* ===================== FIND BY ID ===================== */
  static async findById(id) {
    return await Warranty.findOne({
      where: { id },
      include: [
        {
          model: Variant,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          required: false,
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              required: false
            }
          ]
        }
      ]
    });
  }

  /* ===================== FIND BY CODE ===================== */
  static async findByCode(code) {
    return await Warranty.findOne({
      where: { warranty_code: code }
    });
  }

  /* ===================== FIND ALL (SEARCH + FILTER + PAGINATION) ===================== */
  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      status,
      keyword,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    /* -------- FILTER -------- */
    if (status) {
      where.status = status;
    }

    /* -------- SEARCH -------- */
    if (keyword) {
      where[Op.or] = [
        {
          warranty_code: {
            [Op.like]: `%${keyword}%`
          }
        }
      ];
    }

    const data = await Warranty.findAndCountAll({
      where,
      include: [
        {
          model: Variant,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          required: false,
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              required: false,
              where: keyword
                ? {
                    name: {
                      [Op.like]: `%${keyword}%`
                    }
                  }
                : undefined
            }
          ]
        }
      ],
      order: [[sort, order.toUpperCase()]],
      limit,
      offset,
      distinct: true // 🔥 fix count khi join
    });

    return Pagination.getPagingData(data, page, limit);
  }

  /* ===================== CREATE ===================== */
  static async create(data) {
    const warranty = await Warranty.create(data);
    return await this.findById(warranty.id);
  }

  /* ===================== UPDATE ===================== */
  static async update(id, data) {
    await Warranty.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  /* ===================== DELETE ===================== */
  static async delete(id) {
    await Warranty.destroy({
      where: { id }
    });

    return true;
  }
}

export default WarrantyRepository;
