import OrderStatusLogService from "./orderStatusLog.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class OrderStatusLogController {

  getLogs = asyncHandler(async (req, res) => {

    const logs = await OrderStatusLogService.getLogs(req.query);

    return response.success(res, logs);
  });

  getLogById = asyncHandler(async (req, res) => {

    const log = await OrderStatusLogService.getLogById(req.params.id);

    return response.success(res, log);
  });

  createLog = asyncHandler(async (req, res) => {

    const log = await OrderStatusLogService.createLog(req.body);

    return response.success(res, log, "Order status log created");
  });

}

export default new OrderStatusLogController();
