import PromotionItemService from "./promotionItem.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PromotionItemController {

  getItems = asyncHandler(async (req, res) => {

    const items = await PromotionItemService.getItems(req.query);

    return response.success(res, items);
  });

  getItemById = asyncHandler(async (req, res) => {

    const item = await PromotionItemService.getItemById(req.params.id);

    return response.success(res, item);
  });

  createItem = asyncHandler(async (req, res) => {

    const item = await PromotionItemService.createItem(req.body);

    return response.success(res, item, "Promotion item created");
  });

  updateItem = asyncHandler(async (req, res) => {

    const item = await PromotionItemService.updateItem(req.params.id, req.body);

    return response.success(res, item, "Promotion item updated");
  });

  deleteItem = asyncHandler(async (req, res) => {

    await PromotionItemService.deleteItem(req.params.id);

    return response.success(res, null, "Promotion item deleted");
  });
}

export default new PromotionItemController();
