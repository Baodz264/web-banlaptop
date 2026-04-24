import ShipmentService from "./shipment.service.js";
import ShipmentFeeService from "./shipmentFee.service.js"; // 🔥 thêm

import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ShipmentController {

  getShipments = asyncHandler(async (req, res) => {
    const shipments = await ShipmentService.getShipments(req.query);
    return response.success(res, shipments);
  });

  getShipmentById = asyncHandler(async (req, res) => {
    const shipment = await ShipmentService.getShipmentById(req.params.id);
    return response.success(res, shipment);
  });

  createShipment = asyncHandler(async (req, res) => {
    const shipment = await ShipmentService.createShipment(req.body);
    return response.success(res, shipment, "Shipment created");
  });

  updateShipment = asyncHandler(async (req, res) => {
    const shipment = await ShipmentService.updateShipment(
      req.params.id,
      req.body
    );
    return response.success(res, shipment, "Shipment updated");
  });

  deleteShipment = asyncHandler(async (req, res) => {
    await ShipmentService.deleteShipment(req.params.id);
    return response.success(res, null, "Shipment deleted");
  });

  // 🔥 NEW: tính phí ship (Shopee style)
  calculateFee = asyncHandler(async (req, res) => {
    const result = await ShipmentFeeService.calculateShippingFee(req.body);
    return response.success(res, result);
  });

}

export default new ShipmentController();
