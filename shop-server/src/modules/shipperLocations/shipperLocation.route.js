import express from "express";
import ShipperLocationController from "./shipperLocation.controller.js";

import { updateLocationValidator } from "./shipperLocation.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/update-location",
  authMiddleware,
  roleMiddleware("shipper"),
  updateLocationValidator,
  validate,
  ShipperLocationController.updateLocation
);

router.get(
  "/shipment/:shipment_id",
  authMiddleware,
  ShipperLocationController.getShipmentLocation
);

export default router;
