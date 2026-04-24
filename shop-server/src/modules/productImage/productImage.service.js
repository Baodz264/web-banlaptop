import ProductImageRepository from "./productImage.repository.js";
import ProductRepository from "../products/product.repository.js";

class ProductImageService {

  static async getImages(product_id) {

    const product = await ProductRepository.findById(product_id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return await ProductImageRepository.findAllByProduct(product_id);
  }

  static async createImage(data) {

    const product = await ProductRepository.findById(data.product_id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return await ProductImageRepository.create(data);
  }

  static async deleteImage(id) {

    const image = await ProductImageRepository.findById(id);

    if (!image) {
      throw new Error("Không tìm thấy hình ảnh");
    }

    return await ProductImageRepository.delete(id);
  }

}

export default ProductImageService;
