import ProductAccessoryService from "./productAccessory.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ProductAccessoryController {

  getAccessoriesByProduct = asyncHandler(async (req, res) => {

    const data = await ProductAccessoryService.getAccessoriesByProduct(
      req.params.product_id
    );

    return response.success(res, data);
  });

  addAccessory = asyncHandler(async (req, res) => {

    const accessory = await ProductAccessoryService.addAccessory(req.body);

    return response.success(res, accessory, "Accessory added to product");
  });

  removeAccessory = asyncHandler(async (req, res) => {

    const { product_id, accessory_id } = req.params;

    await ProductAccessoryService.removeAccessory(product_id, accessory_id);

    return response.success(res, null, "Accessory removed");
  });
}

export default new ProductAccessoryController();
