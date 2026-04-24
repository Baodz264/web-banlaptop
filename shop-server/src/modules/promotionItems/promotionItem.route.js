import express from "express";
import PromotionItemController from "./promotionItem.controller.js";

import {
  createPromotionItemValidator,
  updatePromotionItemValidator
} from "./promotionItem.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", PromotionItemController.getItems);

router.get("/:id", PromotionItemController.getItemById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff"),
  createPromotionItemValidator,
  validate,
  PromotionItemController.createItem
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  updatePromotionItemValidator,
  validate,
  PromotionItemController.updateItem
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  PromotionItemController.deleteItem
);

export default router;
