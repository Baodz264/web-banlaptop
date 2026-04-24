import ProductRepository from "./product.repository.js";
import slugify from "../../utils/slugify.js";

import {
  getCache,
  setCache,
  deleteCache
} from "../../cache/redis.cache.js";

import { CacheKeys } from "../../cache/redis.keys.js";

class ProductService {

  // ================= GET LIST =================
  static async getProducts(query) {
    // ❌ chưa cache (query phức tạp)
    return await ProductRepository.findAll(query);
  }

  // ================= GET BY ID (CÓ CACHE) =================
  static async getProductById(id) {
    const key = CacheKeys.PRODUCT(id);

    // 🔥 1. check cache
    const cached = await getCache(key);
    if (cached) return cached;

    // 🔥 2. query DB
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // 🔥 3. set cache
    await setCache(key, product, 600); // cache 10 phút

    return product;
  }

  // ================= CREATE =================
  static async createProduct(data) {

    const exist = await ProductRepository.findByName(data.name);

    // 🔥 CASE 1: tồn tại nhưng đã xoá → restore
    if (exist && exist.deleted_at !== null) {
      await exist.update({
        ...data,
        deleted_at: null
      });

      // 🔥 clear cache (nếu có)
      await deleteCache(CacheKeys.PRODUCT(exist.id));

      return exist;
    }

    // 🔥 CASE 2: tồn tại và chưa xoá → lỗi
    if (exist && exist.deleted_at === null) {
      throw new Error("Tên sản phẩm đã tồn tại");
    }

    // ✅ tạo mới
    data.slug = slugify(data.name);

    const existSlug = await ProductRepository.findBySlug(data.slug);

    if (existSlug) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    const created = await ProductRepository.create(data);

    return created;
  }

  // ================= UPDATE =================
  static async updateProduct(id, data) {

    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    if (data.name) {
      const existName = await ProductRepository.findByName(data.name);

      if (existName && existName.id !== Number(id)) {
        throw new Error("Tên sản phẩm đã tồn tại");
      }

      data.slug = slugify(data.name);
    }

    const updated = await ProductRepository.update(id, data);

    // 🔥 clear cache
    await deleteCache(CacheKeys.PRODUCT(id));

    return updated;
  }

  // ================= DELETE =================
  static async deleteProduct(id) {

    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    await ProductRepository.softDelete(id);

    // 🔥 clear cache
    await deleteCache(CacheKeys.PRODUCT(id));

    return true;
  }

  // ================= BULK CREATE =================
  static async createBulkProducts(products) {
    const newProducts = [];

    for (let item of products) {

      const exist = await ProductRepository.findByName(item.name);

      // 🔥 CASE 1: restore
      if (exist && exist.deleted_at !== null) {
        await exist.update({
          ...item,
          deleted_at: null
        });

        await deleteCache(CacheKeys.PRODUCT(exist.id));
        continue;
      }

      // 🔥 CASE 2: trùng
      if (exist && exist.deleted_at === null) {
        throw new Error(`Sản phẩm "${item.name}" đã tồn tại`);
      }

      // ✅ tạo mới
      let slug = slugify(item.name);

      const existSlug = await ProductRepository.findBySlug(slug);

      if (existSlug) {
        slug = `${slug}-${Date.now()}`;
      }

      newProducts.push({
        ...item,
        slug
      });
    }

    if (newProducts.length > 0) {
      return await ProductRepository.bulkCreate(newProducts);
    }

    return [];
  }
}

export default ProductService;
