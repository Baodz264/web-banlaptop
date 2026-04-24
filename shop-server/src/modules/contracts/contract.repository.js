import { Op } from "sequelize";
import Contract from "../../database/mysql/contract/contract.model.js";
import Pagination from "../../utils/pagination.js";

class ContractRepository {

  /* ================= GET BY ID ================= */
  static async findById(id) {
    return await Contract.findOne({
      where: { id }
    });
  }

  /* ================= GET BY CODE ================= */
  static async findByCode(contract_code) {
    return await Contract.findOne({
      where: { contract_code }
    });
  }

  /* ================= GET ALL + SEARCH + FILTER + PAGINATION ================= */
  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      supplier_id,
      status,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    /* ================= SEARCH ================= */
    if (search) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          contract_code: {
            [Op.like]: `%${search}%`
          }
        }
      ];
    }

    /* ================= FILTER ================= */
    if (supplier_id) {
      where.supplier_id = supplier_id;
    }

    // Fix bug status = 0
    if (status !== undefined && status !== "") {
      where.status = status;
    }

    /* ================= SORT SAFE ================= */
    const validSort = ["id", "title", "contract_code", "created_at"];
    const validOrder = ["ASC", "DESC"];

    const sortField = validSort.includes(sort) ? sort : "id";
    const sortOrder = validOrder.includes(order.toUpperCase())
      ? order.toUpperCase()
      : "DESC";

    /* ================= QUERY ================= */
    const data = await Contract.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit,
      offset
    });

    return Pagination.getPagingData(data, page, limit);
  }

  /* ================= CREATE ================= */
  static async create(data) {

    // check trùng contract_code
    if (data.contract_code) {
      const existing = await this.findByCode(data.contract_code);
      if (existing) {
        throw new Error("Contract code already exists");
      }
    }

    const contract = await Contract.create(data);
    return await this.findById(contract.id);
  }

  /* ================= UPDATE ================= */
  static async update(id, data) {

    const contract = await this.findById(id);
    if (!contract) {
      throw new Error("Contract not found");
    }

    // check trùng code khi update
    if (data.contract_code) {
      const existing = await this.findByCode(data.contract_code);
      if (existing && existing.id !== id) {
        throw new Error("Contract code already exists");
      }
    }

    await Contract.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  /* ================= DELETE ================= */
  static async delete(id) {

    const contract = await this.findById(id);
    if (!contract) {
      throw new Error("Contract not found");
    }

    await Contract.destroy({
      where: { id }
    });

    return true;
  }
}

export default ContractRepository;
