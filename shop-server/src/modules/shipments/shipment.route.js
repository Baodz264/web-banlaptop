import express from "express";
import ShipmentController from "./shipment.controller.js";

import {
  createShipmentValidator,
  updateShipmentValidator
} from "./shipment.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", ShipmentController.getShipments);

router.get("/:id", ShipmentController.getShipmentById);

// 🔥 NEW API (KHÔNG cần login cũng được)
router.post("/calculate-fee", ShipmentController.calculateFee);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  createShipmentValidator,
  validate,
  ShipmentController.createShipment
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff","shipper"),
  updateShipmentValidator,
  validate,
  ShipmentController.updateShipment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  ShipmentController.deleteShipment
);

export default router;
