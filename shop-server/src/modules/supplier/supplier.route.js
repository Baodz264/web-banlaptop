import express from "express";
import SupplierController from "./supplier.controller.js";

import {
  createSupplierValidator,
  updateSupplierValidator
} from "./supplier.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", SupplierController.getSuppliers);

router.get("/:id", SupplierController.getSupplierById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSupplierValidator,
  validate,
  SupplierController.createSupplier
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSupplierValidator,
  validate,
  SupplierController.updateSupplier
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  SupplierController.deleteSupplier
);

export default router;
