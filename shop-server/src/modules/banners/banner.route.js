import express from "express";
import BannerController from "./banner.controller.js";

import {
  createBannerValidator,
  updateBannerValidator,
} from "./banner.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadBanner = createUploader("banners");

router.get("/", BannerController.getBanners);

router.get("/:id", BannerController.getBannerById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadBanner.single("image"),
  createBannerValidator,
  validate,
  BannerController.createBanner
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadBanner.single("image"),
  updateBannerValidator,
  validate,
  BannerController.updateBanner
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  BannerController.deleteBanner
);

export default router;
