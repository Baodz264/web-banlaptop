import PostImageService from "./postImage.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PostImageController {

  getPostImages = asyncHandler(async (req, res) => {

    const images = await PostImageService.getPostImages(req.query);

    return response.success(res, images);
  });

  getPostImageById = asyncHandler(async (req, res) => {

    const image = await PostImageService.getPostImageById(req.params.id);

    return response.success(res, image);
  });

  createPostImage = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/posts/${req.file.filename}`;
    }

    const image = await PostImageService.createPostImage(data);

    return response.success(res, image, "Post image created");
  });

  updatePostImage = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/posts/${req.file.filename}`;
    }

    const image = await PostImageService.updatePostImage(req.params.id, data);

    return response.success(res, image, "Post image updated");
  });

  deletePostImage = asyncHandler(async (req, res) => {

    await PostImageService.deletePostImage(req.params.id);

    return response.success(res, null, "Post image deleted");
  });
}

export default new PostImageController();
