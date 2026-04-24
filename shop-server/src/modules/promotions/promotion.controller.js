import PromotionService from "./promotion.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PromotionController {

  getPromotions = asyncHandler(async (req, res) => {

    const promotions = await PromotionService.getPromotions(req.query);

    return response.success(res, promotions);
  });

  getPromotionById = asyncHandler(async (req, res) => {

    const promotion = await PromotionService.getPromotionById(req.params.id);

    return response.success(res, promotion);
  });

  createPromotion = asyncHandler(async (req, res) => {

    const promotion = await PromotionService.createPromotion(req.body);

    return response.success(res, promotion, "Promotion created");
  });

  updatePromotion = asyncHandler(async (req, res) => {

    const promotion = await PromotionService.updatePromotion(
      req.params.id,
      req.body
    );

    return response.success(res, promotion, "Promotion updated");
  });

  deletePromotion = asyncHandler(async (req, res) => {

    await PromotionService.deletePromotion(req.params.id);

    return response.success(res, null, "Promotion deleted");
  });

}

export default new PromotionController();
