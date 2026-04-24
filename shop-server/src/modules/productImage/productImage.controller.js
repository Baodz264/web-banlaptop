import ProductImageService from "./productImage.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductImageController {

  getImages = asyncHandler(async (req, res) => {

    const images = await ProductImageService.getImages(req.params.product_id);

    return response.success(res, images);
  });

  createImage = asyncHandler(async (req, res) => {

    const data = {
      product_id: req.body.product_id
    };

    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
    }

    const image = await ProductImageService.createImage(data);

    return response.success(res, image, "Image created");
  });

  deleteImage = asyncHandler(async (req, res) => {

    await ProductImageService.deleteImage(req.params.id);

    return response.success(res, null, "Image deleted");
  });

}

export default new ProductImageController();
