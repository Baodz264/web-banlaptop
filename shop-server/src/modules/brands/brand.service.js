import BrandRepository from "./brand.repository.js";
import slugify from "../../utils/slugify.js";

class BrandService {

  static async getBrands(query) {
    return await BrandRepository.findAll(query);
  }

  static async getBrandById(id) {

    const brand = await BrandRepository.findById(id);

    if (!brand) {
      throw new Error("Không tìm thấy thương hiệu");
    }

    return brand;
  }

  static async createBrand(data) {

    data.slug = slugify(data.name);

    const exist = await BrandRepository.findBySlug(data.slug);

    if (exist) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return await BrandRepository.create(data);
  }

  static async updateBrand(id, data) {

    const brand = await BrandRepository.findById(id);

    if (!brand) {
      throw new Error("Không tìm thấy thương hiệu");
    }

    if (data.name) {
      data.slug = slugify(data.name);
    }

    return await BrandRepository.update(id, data);
  }

  static async deleteBrand(id) {

    const brand = await BrandRepository.findById(id);

    if (!brand) {
      throw new Error("Không tìm thấy thương hiệu");
    }

    return await BrandRepository.delete(id);
  }
}

export default BrandService;
