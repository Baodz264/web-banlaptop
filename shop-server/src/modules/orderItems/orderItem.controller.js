import OrderItemService from "./orderItem.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class OrderItemController {

  getOrderItems = asyncHandler(async (req, res) => {
    const items = await OrderItemService.getOrderItems(req.query);
    return response.success(res, items);
  });

  getOrderItemById = asyncHandler(async (req, res) => {
    const item = await OrderItemService.getOrderItemById(req.params.id);
    return response.success(res, item);
  });

  createOrderItem = asyncHandler(async (req, res) => {
    const item = await OrderItemService.createOrderItem(req.body);
    return response.success(res, item, "Order item created");
  });

  updateOrderItem = asyncHandler(async (req, res) => {
    const item = await OrderItemService.updateOrderItem(
      req.params.id,
      req.body
    );
    return response.success(res, item, "Order item updated");
  });

  deleteOrderItem = asyncHandler(async (req, res) => {
    await OrderItemService.deleteOrderItem(req.params.id);
    return response.success(res, null, "Order item deleted");
  });
}

export default new OrderItemController();
