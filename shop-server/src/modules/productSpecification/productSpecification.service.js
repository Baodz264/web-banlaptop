import ProductSpecificationRepository from "./productSpecification.repository.js";

class ProductSpecificationService {

  static async getSpecifications(product_id) {
    return await ProductSpecificationRepository.findByProduct(product_id);
  }

  static async getSpecificationById(id) {

    const spec = await ProductSpecificationRepository.findById(id);

    if (!spec) {
      throw new Error("Không tìm thấy thông số kỹ thuật");
    }

    return spec;
  }

  static async createSpecification(data) {

    return await ProductSpecificationRepository.create(data);
  }

  static async updateSpecification(id, data) {

    const spec = await ProductSpecificationRepository.findById(id);

    if (!spec) {
      throw new Error("Không tìm thấy thông số kỹ thuật");
    }

    return await ProductSpecificationRepository.update(id, data);
  }

  static async deleteSpecification(id) {

    const spec = await ProductSpecificationRepository.findById(id);

    if (!spec) {
      throw new Error("Không tìm thấy thông số kỹ thuật");
    }

    return await ProductSpecificationRepository.delete(id);
  }

}

export default ProductSpecificationService;
