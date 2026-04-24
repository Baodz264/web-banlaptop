import OrderService from "./order.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class OrderController {

  getOrders = asyncHandler(async (req, res) => {
    const orders = await OrderService.getOrders(req.query);
    return response.success(res, orders);
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await OrderService.getOrderById(req.params.id);
    return response.success(res, order);
  });

  createOrder = asyncHandler(async (req, res) => {
    const order = await OrderService.createOrder(req.body);
    return response.success(res, order, "Order created");
  });

  updateOrder = asyncHandler(async (req, res) => {
    const order = await OrderService.updateOrder(req.params.id, req.body);
    return response.success(res, order, "Order updated");
  });

  deleteOrder = asyncHandler(async (req, res) => {
    await OrderService.deleteOrder(req.params.id);
    return response.success(res, null, "Order deleted");
  });
}

export default new OrderController();
