import express from "express";
import PromotionController from "./promotion.controller.js";

import {
  createPromotionValidator,
  updatePromotionValidator
} from "./promotion.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", PromotionController.getPromotions);

router.get("/:id", PromotionController.getPromotionById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff"),
  createPromotionValidator,
  validate,
  PromotionController.createPromotion
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  updatePromotionValidator,
  validate,
  PromotionController.updatePromotion
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  PromotionController.deletePromotion
);

export default router;
