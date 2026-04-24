import ReviewImageService from "./reviewImage.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ReviewImageController {

  getImagesByReview = asyncHandler(async (req, res) => {

    const images = await ReviewImageService.getImagesByReview(
      req.params.review_id
    );

    return response.success(res, images);
  });

  createImage = asyncHandler(async (req, res) => {

    const data = {
      review_id: req.body.review_id,
    };

    if (req.file) {
      data.image = `/uploads/reviews/${req.file.filename}`;
    }

    const image = await ReviewImageService.createImage(data);

    return response.success(res, image, "Image created");
  });

  deleteImage = asyncHandler(async (req, res) => {

    await ReviewImageService.deleteImage(req.params.id);

    return response.success(res, null, "Image deleted");
  });
}

export default new ReviewImageController();
