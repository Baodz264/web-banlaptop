import express from "express";
import AttributeController from "./attribute.controller.js";

import {
  createAttributeValidator,
  updateAttributeValidator
} from "./attribute.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", AttributeController.getAttributes);

router.get("/:id", AttributeController.getAttributeById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAttributeValidator,
  validate,
  AttributeController.createAttribute
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAttributeValidator,
  validate,
  AttributeController.updateAttribute
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  AttributeController.deleteAttribute
);

export default router;
