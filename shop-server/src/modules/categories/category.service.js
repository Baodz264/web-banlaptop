import CategoryRepository from "./category.repository.js";
import slugify from "../../utils/slugify.js";

class CategoryService {

  static async getCategories(query) {
    return await CategoryRepository.findAll(query);
  }

  static async getCategoryById(id) {

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    return category;
  }

  static async createCategory(data) {

    data.slug = slugify(data.name);

    const exist = await CategoryRepository.findBySlug(data.slug);

    if (exist) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return await CategoryRepository.create(data);
  }

  static async updateCategory(id, data) {

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    if (data.name) {
      data.slug = slugify(data.name);
    }

    return await CategoryRepository.update(id, data);
  }

  static async deleteCategory(id) {

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    return await CategoryRepository.softDelete(id);
  }
}

export default CategoryService;
