import express from "express";
import ShipmentProofController from "./shipmentProof.controller.js";

import {
  createShipmentProofValidator,
  updateShipmentProofValidator
} from "./shipmentProof.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadProof = createUploader("shipment-proofs");

router.get("/", ShipmentProofController.getShipmentProofs);

router.get("/:id", ShipmentProofController.getShipmentProofById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "shipper"),
  uploadProof.single("image"),
  createShipmentProofValidator,
  validate,
  ShipmentProofController.createShipmentProof
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "shipper"),
  uploadProof.single("image"),
  updateShipmentProofValidator,
  validate,
  ShipmentProofController.updateShipmentProof
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "shipper"),
  ShipmentProofController.deleteShipmentProof
);

export default router;
