import { Op, Sequelize } from "sequelize";
import Pagination from "../../utils/pagination.js";

import {
  Product,
  Category,
  Brand,
  ProductImage,
  ProductSpecification,
  Variant,
  AttributeValue,
  Attribute,
  Inventory,
  Supplier,
  Review,
} from "../../database/mysql/index.js";

/* ================= SEARCH KEYWORD MAP ================= */
const keywordMap = {
  laptop: ["macbook", "dell", "hp", "asus", "msi", "lenovo"],
  gaming: ["rog", "msi", "acer"],
  chuot: ["logitech", "razer"],
  ram: ["kingston", "corsair"],
  ssd: ["samsung", "kingston"],
  monitor: ["dell", "samsung"],
  computer: ["laptop"],
  pc: ["computer", "laptop"],
};

/* ================= NORMALIZE ================= */
const normalize = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ");
};

/* ================= SIMPLE TYPO FIX ================= */
const typoMap = {
  laptopp: "laptop",
  macboook: "macbook",
  logitec: "logitech",
  razeer: "razer",
  samsng: "samsung",
  banphim: "ban phim",
  chuotgaming: "chuot gaming",
  compoter: "computer",
  computar: "computer",
};

const fixTypo = (word) => {
  return typoMap[word] || word;
};

/* ================= EXPAND KEYWORD (SAFE VERSION) ================= */
const expandKeyword = (keyword) => {
  if (!keyword) return [];

  const normalized = normalize(keyword);
  const words = normalized.split(" ").filter(Boolean).map(fixTypo);

  const resultSet = new Set();

  const phrase = words.join(" ");

  const add = (k) => {
    if (!k) return;

    resultSet.add(k);

    const related = keywordMap[k];
    if (Array.isArray(related)) {
      related.forEach((v) => resultSet.add(v));
    }
  };

  // ================= CASE 1: match cả cụm =================
  if (phrase && keywordMap[phrase]) {
    add(phrase);
  }

  // ================= CASE 2: từng từ =================
  for (const w of words) {
    add(w);

    // ================= CASE 3: dính chữ =================
    for (const k of Object.keys(keywordMap)) {
      if (!k) continue;

      const cleanKey = k.replace(/\s+/g, "");

      if (w && cleanKey && w.includes(cleanKey)) {
        add(k);
      }
    }
  }

  return [...resultSet];
};

class ProductRepository {
  // ================= BASE INCLUDE =================
  static baseInclude = [
    { model: Category, attributes: ["id", "name", "slug"] },
    { model: Brand, attributes: ["id", "name", "slug"] },
    { model: ProductImage, attributes: ["id", "image"] },
    {
      model: ProductSpecification,
      attributes: ["id", "spec_group", "spec_name", "spec_value", "sort_order"],
    },
    {
      model: Variant,
      required: false,
      include: [
        {
          model: AttributeValue,
          attributes: ["id", "value"],
          through: { attributes: [] },
          include: [{ model: Attribute, attributes: ["id", "name"] }],
        },
        {
          model: Inventory,
          attributes: ["id", "quantity"],
          include: [{ model: Supplier, attributes: ["id", "name"] }],
        },
      ],
    },
  ];

  // ================= FIND BY ID =================
  static async findById(id) {
    return await Product.findOne({
      where: { id, deleted_at: null },
      include: this.baseInclude,
    });
  }

  // ================= FIND BY SLUG =================
  static async findBySlug(slug) {
    return await Product.findOne({
      where: { slug, deleted_at: null },
      include: this.baseInclude,
    });
  }

  // ================= FIND BY NAME =================
  static async findByName(name) {
    return await Product.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        (name || "").toLowerCase(),
      ),
    });
  }

  // ================= FIND ALL + FILTER =================
  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      category_id,
      brand_id,
      status,
      product_type,
      minPrice,
      maxPrice,
      inStock,
      sort = "created_at",
      order = "DESC",
      rating,
    } = query;

    const where = { deleted_at: null };

    /* ================= UPGRADED SEARCH (FIXED + SAFE) ================= */
    if (search) {
      const keywords = expandKeyword(search).slice(0, 10);

      const orConditions = [];

      for (const k of keywords) {
        if (!k) continue;

        orConditions.push(
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Product.name")),
            { [Op.like]: `%${k}%` },
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Product.description")),
            { [Op.like]: `%${k}%` },
          ),
        );
      }

      if (orConditions.length > 0) {
        where[Op.or] = orConditions;
      }
    }

    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (status) where.status = status;
    if (product_type) where.product_type = product_type;

    const inventoryInclude = {
      model: Inventory,
      attributes: ["id", "quantity"],
      include: [{ model: Supplier, attributes: ["id", "name"] }],
    };

    if (inStock === "true") {
      inventoryInclude.where = { quantity: { [Op.gt]: 0 } };
    }

    // ================= GET PRODUCTS =================
    const data = await Product.findAndCountAll({
      where,
      distinct: true,
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
          required: false,
        },
        {
          model: Brand,
          attributes: ["id", "name", "slug"],
          required: false,
        },
        { model: ProductImage, attributes: ["id", "image"] },
        {
          model: Variant,
          required: false,
          include: [
            {
              model: AttributeValue,
              attributes: ["id", "value"],
              through: { attributes: [] },
              include: [{ model: Attribute, attributes: ["id", "name"] }],
            },
            inventoryInclude,
          ],
        },
      ],
      order: sort === "price" ? [["created_at", "DESC"]] : [[sort, order]],
      limit,
      offset,
    });

    // ================= GET RATING =================
    const productIds = data.rows.map((p) => p.id);

    let ratingMap = {};

    if (productIds.length > 0) {
      const ratings = await Review.findAll({
        where: {
          product_id: { [Op.in]: productIds },
          parent_id: null,
        },
        attributes: [
          "product_id",
          [Sequelize.fn("AVG", Sequelize.col("rating")), "avg_rating"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "review_count"],
        ],
        group: ["product_id"],
        raw: true,
      });

      ratings.forEach((r) => {
        ratingMap[r.product_id] = {
          avg_rating: Number(r.avg_rating || 0),
          review_count: Number(r.review_count || 0),
        };
      });
    }

    // ================= FILTER + MAP =================
    const filteredRows = data.rows.filter((product) => {
      const variants = product.Variants || [];

      const minVariantPrice = variants.length
        ? Math.min(...variants.map((v) => Number(v.price || 0)))
        : Number(product.price || 0);

      if (minPrice !== undefined && minVariantPrice < minPrice) return false;
      if (maxPrice !== undefined && minVariantPrice > maxPrice) return false;

      product.price = minVariantPrice;

      const ratingData = ratingMap[product.id] || {
        avg_rating: 0,
        review_count: 0,
      };

      product.avg_rating = ratingData.avg_rating;
      product.review_count = ratingData.review_count;

      if (rating) {
        const ratingsFilter =
          typeof rating === "string" ? rating.split(",").map(Number) : rating;

        const match = ratingsFilter.some(
          (r) => product.avg_rating >= r && product.avg_rating < r + 1,
        );

        if (!match) return false;
      }

      return true;
    });

    return Pagination.getPagingData(
      {
        count: data.count,
        rows: filteredRows,
      },
      page,
      limit,
    );
  }

  // ================= CREATE =================
  static async create(data) {
    const product = await Product.create(data);
    return await this.findById(product.id);
  }

  // ================= UPDATE =================
  static async update(id, data) {
    await Product.update(data, { where: { id, deleted_at: null } });
    return await this.findById(id);
  }

  // ================= SOFT DELETE =================
  static async softDelete(id) {
    await Product.update(
      { deleted_at: new Date() },
      { where: { id, deleted_at: null } },
    );
    return true;
  }

  // ================= BULK CREATE =================
  static async bulkCreate(data) {
    return await Product.bulkCreate(data);
  }
}

export default ProductRepository;
