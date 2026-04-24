import ProductBundleItemService from "./bundleItem.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductBundleItemController {

  getItems = asyncHandler(async (req, res) => {

    const items = await ProductBundleItemService.getItems();

    return response.success(res, items);
  });

  getItemsByBundle = asyncHandler(async (req, res) => {

    const items = await ProductBundleItemService.getItemsByBundle(
      req.params.bundle_id
    );

    return response.success(res, items);
  });

  createItem = asyncHandler(async (req, res) => {

    const item = await ProductBundleItemService.createItem(req.body);

    return response.success(res, item, "Bundle item created");
  });

  deleteItem = asyncHandler(async (req, res) => {

    await ProductBundleItemService.deleteItem(
      req.params.bundle_id,
      req.params.variant_id
    );

    return response.success(res, null, "Bundle item deleted");
  });
}

export default new ProductBundleItemController();
