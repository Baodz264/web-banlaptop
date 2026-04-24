import InventoryLogService from "./inventoryLog.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class InventoryLogController {

  getLogs = asyncHandler(async (req, res) => {

    const logs = await InventoryLogService.getLogs(req.query);

    return response.success(res, logs);
  });

  getLogById = asyncHandler(async (req, res) => {

    const log = await InventoryLogService.getLogById(req.params.id);

    return response.success(res, log);
  });

  createLog = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const log = await InventoryLogService.createLog(data);

    return response.success(res, log, "Inventory log created");
  });

}

export default new InventoryLogController();
