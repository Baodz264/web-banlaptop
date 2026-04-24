import { Op } from "sequelize";
import {
  Category,
  Product,
  VoucherApply
} from "../../database/mysql/index.js";

import Pagination from "../../utils/pagination.js";

class CategoryRepository {

  /* ================= INCLUDE (TỐI ƯU NHẸ) ================= */
  static getInclude(query) {
    const include = [];

    // parent (luôn cần)
    include.push({
      model: Category,
      as: "parent",
      attributes: ["id", "name", "slug"]
    });

    // chỉ load khi cần
    if (query.withChildren === "true") {
      include.push({
        model: Category,
        as: "children",
        attributes: ["id", "name", "slug"]
      });
    }

    if (query.withProduct === "true") {
      include.push({
        model: Product,
        attributes: ["id", "name"]
      });
    }

    if (query.withVoucher === "true") {
      include.push({
        model: VoucherApply,
        attributes: ["id", "voucher_id"]
      });
    }

    return include;
  }

  /* ================= FIND BY ID ================= */
  static async findById(id) {
    return await Category.findOne({
      where: { id, deleted_at: null },
      include: this.getInclude({ withChildren: "true" })
    });
  }

  /* ================= FIND BY SLUG ================= */
  static async findBySlug(slug) {
    return await Category.findOne({
      where: { slug, deleted_at: null },
      include: this.getInclude({ withChildren: "true" })
    });
  }

  /* ================= FIND ALL ================= */
  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    let {
      search,
      parent_id,
      status,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {
      deleted_at: null
    };

    /* ================= SEARCH (NÂNG CẤP) ================= */
    if (search) {
      const keywords = search.trim().split(/\s+/);

      where[Op.and] = keywords.map(keyword => ({
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { slug: { [Op.like]: `%${keyword}%` } }
        ]
      }));
    }

    /* ================= FILTER ================= */
    if (parent_id !== undefined) {
      where.parent_id = parent_id;
    }

    if (status !== undefined) {
      where.status = status;
    }

    /* ================= SORT (SAFE) ================= */
    const allowedSort = ["id", "name", "created_at", "updated_at"];
    const sortField = allowedSort.includes(sort) ? sort : "id";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    /* ================= QUERY ================= */
    const data = await Category.findAndCountAll({
      where,
      include: this.getInclude(query),
      order: [[sortField, sortOrder]],
      limit,
      offset,
      distinct: true
    });

    return Pagination.getPagingData(data, page, limit);
  }

  /* ================= CREATE ================= */
  static async create(data) {
    const category = await Category.create(data);
    return await this.findById(category.id);
  }

  /* ================= UPDATE ================= */
  static async update(id, data) {

    await Category.update(data, {
      where: { id, deleted_at: null }
    });

    return await this.findById(id);
  }

  /* ================= SOFT DELETE ================= */
  static async softDelete(id) {

    await Category.update(
      { deleted_at: new Date() },
      { where: { id, deleted_at: null } }
    );

    return true;
  }
}

export default CategoryRepository;
