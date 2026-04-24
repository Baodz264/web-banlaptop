import InventoryService from "./inventory.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class InventoryController {

  getInventories = asyncHandler(async (req, res) => {

    const inventories = await InventoryService.getInventories(req.query);

    return response.success(res, inventories);
  });

  getInventoryById = asyncHandler(async (req, res) => {

    const inventory = await InventoryService.getInventoryById(req.params.id);

    return response.success(res, inventory);
  });

  createInventory = asyncHandler(async (req, res) => {

    const inventory = await InventoryService.createInventory(req.body);

    return response.success(res, inventory, "Inventory created");
  });

  updateInventory = asyncHandler(async (req, res) => {

    const inventory = await InventoryService.updateInventory(
      req.params.id,
      req.body
    );

    return response.success(res, inventory, "Inventory updated");
  });

  deleteInventory = asyncHandler(async (req, res) => {

    await InventoryService.deleteInventory(req.params.id);

    return response.success(res, null, "Inventory deleted");
  });
}

export default new InventoryController();
