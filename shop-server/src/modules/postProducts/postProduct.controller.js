import PostProductService from "./postProduct.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PostProductController {

  getPostProducts = asyncHandler(async (req, res) => {

    const data = await PostProductService.getPostProducts(req.query);

    return response.success(res, data);
  });

  getPostProduct = asyncHandler(async (req, res) => {

    const { post_id, product_id } = req.params;

    const data = await PostProductService.getPostProduct(
      post_id,
      product_id
    );

    return response.success(res, data);
  });

  createPostProduct = asyncHandler(async (req, res) => {

    const data = await PostProductService.createPostProduct(req.body);

    return response.success(res, data, "PostProduct created");
  });

  deletePostProduct = asyncHandler(async (req, res) => {

    const { post_id, product_id } = req.params;

    await PostProductService.deletePostProduct(post_id, product_id);

    return response.success(res, null, "PostProduct deleted");
  });
}

export default new PostProductController();
