import PostService from "./post.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PostController {

  getPosts = asyncHandler(async (req, res) => {

    const posts = await PostService.getPosts(req.query);

    return response.success(res, posts);
  });

  getPostById = asyncHandler(async (req, res) => {

    const post = await PostService.getPostById(req.params.id);

    return response.success(res, post);
  });

  // ⭐ thêm
  getPostBySlug = asyncHandler(async (req, res) => {

    const post = await PostService.getPostBySlug(req.params.slug);

    return response.success(res, post);
  });

  createPost = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.thumbnail = `/uploads/posts/${req.file.filename}`;
    }

    const post = await PostService.createPost(data);

    return response.success(res, post, "Post created");
  });

  updatePost = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.thumbnail = `/uploads/posts/${req.file.filename}`;
    }

    const post = await PostService.updatePost(req.params.id, data);

    return response.success(res, post, "Post updated");
  });

  deletePost = asyncHandler(async (req, res) => {

    await PostService.deletePost(req.params.id);

    return response.success(res, null, "Post deleted");
  });
}

export default new PostController();
