import express from "express";
import AttributeValueController from "./attributeValue.controller.js";

import {
  createAttributeValueValidator,
  updateAttributeValueValidator
} from "./attributeValue.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", AttributeValueController.getValues);

router.get("/:id", AttributeValueController.getValueById);

router.get("/attribute/:attribute_id", AttributeValueController.getValuesByAttribute);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAttributeValueValidator,
  validate,
  AttributeValueController.createValue
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAttributeValueValidator,
  validate,
  AttributeValueController.updateValue
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  AttributeValueController.deleteValue
);

export default router;
