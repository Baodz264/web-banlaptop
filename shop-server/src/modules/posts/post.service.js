import PostRepository from "./post.repository.js";
import slugify from "../../utils/slugify.js";

class PostService {

  static async getPosts(query) {
    return await PostRepository.findAll(query);
  }

  static async getPostById(id) {

    const post = await PostRepository.findById(id);

    if (!post) {
      throw new Error("Không tìm thấy bài viết");
    }

    return post;
  }

  // ⭐ thêm
  static async getPostBySlug(slug) {

    const post = await PostRepository.findBySlug(slug);

    if (!post) {
      throw new Error("Không tìm thấy bài viết");
    }

    return post;
  }

  static async createPost(data) {

    if (!data.slug && data.title) {
      data.slug = slugify(data.title);
    }

    return await PostRepository.create(data);
  }

  static async updatePost(id, data) {

    const post = await PostRepository.findById(id);

    if (!post) {
      throw new Error("Không tìm thấy bài viết");
    }

    if (data.title && !data.slug) {
      data.slug = slugify(data.title);
    }

    return await PostRepository.update(id, data);
  }

  static async deletePost(id) {

    const post = await PostRepository.findById(id);

    if (!post) {
      throw new Error("Không tìm thấy bài viết");
    }

    return await PostRepository.delete(id);
  }
}

export default PostService;
