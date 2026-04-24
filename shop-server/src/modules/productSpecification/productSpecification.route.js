import express from "express";
import ProductSpecificationController from "./productSpecification.controller.js";

import {
  createSpecificationValidator,
  updateSpecificationValidator
} from "./productSpecification.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/product/:product_id",
  ProductSpecificationController.getSpecifications
);

router.get(
  "/:id",
  ProductSpecificationController.getSpecificationById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSpecificationValidator,
  validate,
  ProductSpecificationController.createSpecification
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSpecificationValidator,
  validate,
  ProductSpecificationController.updateSpecification
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductSpecificationController.deleteSpecification
);

export default router;
