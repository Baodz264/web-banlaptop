import { Op } from "sequelize";
import Pagination from "../../utils/pagination.js";

import {
  User,
  UserAddress,
  Cart,
  CartItem,
  Variant,
  Product,
  Order,
  OrderItem,
  Voucher,
  Post,
} from "../../database/mysql/index.js";

class UserRepository {

  static userAttributes = {
    exclude: ["password", "refresh_token"],
  };

  static userInclude = [
    { model: UserAddress },
    {
      model: Cart,
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Variant,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "slug", "thumbnail"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      model: Order,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Variant,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "slug", "thumbnail"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      model: Voucher,
      through: { attributes: [] },
    },
    {
      model: Post,
      as: "Posts",
    },
  ];

  /* FIND BY ID */

  static async findById(id) {
    return await User.findOne({
      where: { id, deleted_at: null },
      attributes: this.userAttributes,
      include: this.userInclude,
    });
  }

  /* FIND BY EMAIL */

  static async findByEmail(email) {
    return await User.findOne({
      where: { email, deleted_at: null },
    });
  }

  /* FIND ADMINS (NEW) */

  static async findAdmins() {
    return await User.findAll({
      where: {
        role: "admin",
        deleted_at: null,
      },
      attributes: ["id", "name", "email", "avatar", "role"],
      order: [["created_at", "ASC"]],
    });
  }

  /* FIND ALL */

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      role,
      status,
      sort = "created_at",
      order = "DESC",
    } = query;

    const where = {
      deleted_at: null,
    };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) where.role = role;

    if (status !== undefined) where.status = status;

    const data = await User.findAndCountAll({
      where,
      attributes: this.userAttributes,
      include: this.userInclude,
      order: [[sort, order]],
      limit,
      offset,
      distinct: true,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  /* CREATE */

  static async create(data) {
    const user = await User.create(data);
    return await this.findById(user.id);
  }

  /* UPDATE */

  static async update(id, data) {

    await User.update(data, {
      where: { id, deleted_at: null },
    });

    return await this.findById(id);
  }

  /* SOFT DELETE */

  static async softDelete(id) {

    const [rows] = await User.update(
      { deleted_at: new Date() },
      { where: { id, deleted_at: null } }
    );

    return rows > 0;
  }

  /* UPDATE PROFILE */

  static async updateProfile(id, data) {

    await User.update(data, {
      where: { id, deleted_at: null },
    });

    return await this.findById(id);
  }
}

export default UserRepository;
