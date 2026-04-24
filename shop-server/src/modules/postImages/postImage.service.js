import PostImageRepository from "./postImage.repository.js";

class PostImageService {

  static async getPostImages(query) {
    return await PostImageRepository.findAll(query);
  }

  static async getPostImageById(id) {

    const image = await PostImageRepository.findById(id);

    if (!image) {
      throw new Error("Không tìm thấy ảnh bài viết");
    }

    return image;
  }

  static async createPostImage(data) {
    return await PostImageRepository.create(data);
  }

  static async updatePostImage(id, data) {

    const image = await PostImageRepository.findById(id);

    if (!image) {
      throw new Error("Không tìm thấy ảnh bài viết");
    }

    return await PostImageRepository.update(id, data);
  }

  static async deletePostImage(id) {

    const image = await PostImageRepository.findById(id);

    if (!image) {
      throw new Error("Không tìm thấy ảnh bài viết");
    }

    return await PostImageRepository.delete(id);
  }
}

export default PostImageService;
