import PostProductRepository from "./postProduct.repository.js";

class PostProductService {

  static async getPostProducts(query) {
    return await PostProductRepository.findAll(query);
  }

  static async getPostProduct(post_id, product_id) {

    const data = await PostProductRepository.findOne(post_id, product_id);

    if (!data) {
      throw new Error("Không tìm thấy liên kết bài viết và sản phẩm");
    }

    return data;
  }

  static async createPostProduct(data) {

    const exist = await PostProductRepository.findOne(
      data.post_id,
      data.product_id
    );

    if (exist) {
      throw new Error("Liên kết bài viết và sản phẩm đã tồn tại");
    }

    return await PostProductRepository.create(data);
  }

  static async deletePostProduct(post_id, product_id) {

    const exist = await PostProductRepository.findOne(post_id, product_id);

    if (!exist) {
      throw new Error("Không tìm thấy liên kết bài viết và sản phẩm");
    }

    return await PostProductRepository.delete(post_id, product_id);
  }
}

export default PostProductService;
