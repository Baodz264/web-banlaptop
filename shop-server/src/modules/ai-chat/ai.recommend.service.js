import {
  Product,
  Category,
  Brand,
  ProductImage,
  Variant,
  AttributeValue,
  Inventory,
  Supplier,
  Attribute,
  ProductSpecification,
  Promotion,
  PromotionItem
} from "../../database/mysql/index.js";

import { Op } from "sequelize";

// ================= HELPER =================
const isPromotionActive = (promo) => {
  const now = new Date();

  if (Number(promo.status) !== 1) return false;
  if (promo.start_date && now < new Date(promo.start_date)) return false;
  if (promo.end_date && now > new Date(promo.end_date)) return false;

  return true;
};

// ================= PROMOTION =================
const applyPromotion = (variant, product, promotions) => {
  let bestPrice = Number(variant.price);

  for (const promo of promotions) {
    if (!isPromotionActive(promo)) continue;

    for (const item of promo.PromotionItems || []) {
      let match = false;

      switch (item.apply_type) {
        case "all":
          match = true;
          break;
        case "variant":
          match = item.variant_id == variant.id;
          break;
        case "product":
          match = item.product_id == product.id;
          break;
        case "category":
          match = item.category_id == product.category_id;
          break;
        case "brand":
          match = item.brand_id == product.brand_id;
          break;
      }

      if (!match) continue;

      let value = Number(promo.value);

      if (value > 0 && value < 1000) {
        value = value * 1000000;
      }

      let tempPrice = Number(variant.price);

      if (promo.type === "percent") {
        tempPrice *= (1 - value / 100);
      } else {
        tempPrice -= value;
      }

      bestPrice = Math.min(bestPrice, Math.max(0, Math.round(tempPrice)));
    }
  }

  return bestPrice;
};

// ================= SCORE =================
const scoreMatch = (text, keyword) => {
  if (!text) return 0;

  text = text.toLowerCase();
  keyword = keyword.toLowerCase();

  let score = 0;

  if (text === keyword) score += 10;
  if (text.includes(keyword)) score += 6;
  if (keyword.includes(text)) score += 4;

  const keywordParts = keyword.split(" ");
  for (const part of keywordParts) {
    if (text.includes(part)) score += 1;
  }

  return score;
};

// ================= DETECT ACCESSORY =================
const isAccessoryKeyword = (keyword) => {
  const accessoryKeywords = [
    "cáp",
    "sạc",
    "tai nghe",
    "chuột",
    "bàn phím",
    "adapter",
    "dây",
    "usb",
    "hub"
  ];

  return accessoryKeywords.some((k) => keyword.includes(k));
};

// ================= MAIN =================
export const getRecommendations = async (intent = {}, memory = {}) => {
  try {
    const rawKeyword = (intent?.keyword || "").toLowerCase();

    const cleanKeyword = rawKeyword
      .replace(/dưới|trên|triệu|vnd|đ/g, "")
      .trim();

    const maxPrice = intent?.price?.max;
    const minPrice = intent?.price?.min;

    const isAccessorySearch = isAccessoryKeyword(cleanKeyword);

    // ================= LOAD META =================
    const [brands, categories] = await Promise.all([
      Brand.findAll(),
      Category.findAll()
    ]);

    // ================= BRAND SCORE =================
    let bestBrand = null;
    let bestBrandScore = 0;

    for (const b of brands) {
      const score = scoreMatch(b.name, cleanKeyword);
      if (score > bestBrandScore) {
        bestBrandScore = score;
        bestBrand = b;
      }
    }

    // ================= CATEGORY SCORE =================
    let bestCategory = null;
    let bestCategoryScore = 0;

    for (const c of categories) {
      const score = scoreMatch(c.name, cleanKeyword);
      if (score > bestCategoryScore) {
        bestCategoryScore = score;
        bestCategory = c;
      }
    }

    // ================= WHERE =================
    const where = {
      status: 1,
      deleted_at: null
    };

    if (bestBrandScore >= 4) where.brand_id = bestBrand.id;
    if (bestCategoryScore >= 4) where.category_id = bestCategory.id;

    if (!where.brand_id && !where.category_id && cleanKeyword) {
      where.name = {
        [Op.like]: `%${cleanKeyword}%`
      };
    }

    // ================= QUERY =================
    let products = await Product.findAll({
      where,
      limit: 50,
      include: [
        { model: Category },
        { model: Brand },
        { model: ProductImage },
        {
          model: Variant,
          required: false,
          include: [
            { model: AttributeValue, include: [Attribute] },
            { model: Inventory, include: [Supplier] }
          ]
        },
        { 
          model: ProductSpecification,
          as: "ProductSpecifications" 
        },
        {
          model: Product,
          as: "Accessories",
          through: { attributes: [] },
          required: false
        },
        {
          model: Product,
          as: "MainProducts",
          through: { attributes: [] },
          required: false
        }
      ]
    });

    // ================= PROMOTION =================
    const promotions = await Promotion.findAll({
      include: [PromotionItem]
    });

    // ================= ENRICH + SCORE =================
    products = products
      .map((p) => {
        const product = p.toJSON();

        // 🔥 Lấy thông tin giá gốc và giá giảm
        const variants = (product.Variants || []).map((v) => ({
          id: v.id,
          original_price: Number(v.price), // Giá gốc từ DB
          final_price: applyPromotion(v, product, promotions) // Giá sau giảm
        }));

        // Sắp xếp để lấy variant có giá sau giảm tốt nhất
        const bestVariant = variants.length
          ? variants.sort((a, b) => a.final_price - b.final_price)[0]
          : null;

        let score = scoreMatch(product.name, cleanKeyword);

        if (!cleanKeyword) {
          score += product.product_type === "main" ? 20 : -10;
        } else {
          if (product.product_type === "main") {
            score += 10;
          } else {
            if (product.MainProducts?.length) {
              score += isAccessorySearch ? 6 : -2;
            } else {
              score -= 10; 
            }
          }
        }

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.Category?.name || null,
          brand: product.Brand?.name || null,
          price: bestVariant?.final_price || 0,        // Giá hiển thị (đã giảm)
          original_price: bestVariant?.original_price || 0, // 🔥 GIÁ GỐC
          thumbnail: product.thumbnail,
          product_type: product.product_type,
          score,

          parent_products: (product.MainProducts || []).map((p) => ({
            id: p.id,
            name: p.name,
            thumbnail: p.thumbnail
          })),

          accessories: (product.Accessories || []).map((a) => ({
            id: a.id,
            name: a.name,
            thumbnail: a.thumbnail
          })),

          specifications: (product.ProductSpecifications || []).map((s) => ({
            group: s.spec_group,
            name: s.spec_name,
            value: s.spec_value
          })),

          images: (product.ProductImages || []).map((img) => img.image)
        };
      })
      .filter((p) => {
        if (maxPrice && p.price > maxPrice) return false;
        if (minPrice && p.price < minPrice) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);

    // ================= FALLBACK =================
    if (!products.length) {
      products = await Product.findAll({
        where: {
          status: 1,
          deleted_at: null
        },
        limit: 10,
        order: [["id", "DESC"]],
        include: [
          { model: Category },
          { model: Brand },
          { model: ProductImage },
          { 
            model: ProductSpecification,
            as: "ProductSpecifications" 
          },
          { model: Variant } // Include Variant để có giá gốc ở fallback
        ]
      }).then(res => res.map(p => {
        const product = p.toJSON();
        const firstVariant = product.Variants?.[0];
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.Category?.name,
          brand: product.Brand?.name,
          price: Number(firstVariant?.price || 0),
          original_price: Number(firstVariant?.price || 0), // Fallback chưa tính promo nên 2 giá bằng nhau
          thumbnail: product.thumbnail,
          specifications: (product.ProductSpecifications || []).map(s => ({
            group: s.spec_group,
            name: s.spec_name,
            value: s.spec_value
          }))
        };
      }));
    }

    return products;
  } catch (err) {
    console.error("[AI Recommend Error]", err);
    return [];
  }
};