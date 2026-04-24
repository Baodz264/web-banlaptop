import express from "express";
import ProductAccessoryController from "./productAccessory.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import { addAccessoryValidator } from "./productAccessory.validator.js";
import validate from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.get(
  "/product/:product_id",
  ProductAccessoryController.getAccessoriesByProduct
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  addAccessoryValidator,
  validate,
  ProductAccessoryController.addAccessory
);

router.delete(
  "/:product_id/:accessory_id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductAccessoryController.removeAccessory
);

export default router;
