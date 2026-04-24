import ProductBundleRepository from "./bundle.repository.js";

class ProductBundleService {

  static async getBundles(query) {
    return await ProductBundleRepository.findAll(query);
  }

  static async getBundleById(id) {

    const bundle = await ProductBundleRepository.findById(id);

    if (!bundle) {
      throw new Error("Không tìm thấy bundle sản phẩm");
    }

    return bundle;
  }

  static async createBundle(data) {

    return await ProductBundleRepository.create(data);
  }

  static async updateBundle(id, data) {

    const bundle = await ProductBundleRepository.findById(id);

    if (!bundle) {
      throw new Error("Không tìm thấy bundle sản phẩm");
    }

    return await ProductBundleRepository.update(id, data);
  }

  static async deleteBundle(id) {

    const bundle = await ProductBundleRepository.findById(id);

    if (!bundle) {
      throw new Error("Không tìm thấy bundle sản phẩm");
    }

    return await ProductBundleRepository.delete(id);
  }
}

export default ProductBundleService;
