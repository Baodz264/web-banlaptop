import express from "express";
import authController from "./auth.controller.js";

import {
  registerValidator,
  loginValidator,
  refreshValidator,
} from "./auth.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

import passport from "passport";

import "../../config/google.config.js";
import "../../config/facebook.config.js";

const router = express.Router();

/* AUTH */

router.post("/register", registerValidator, validate, authController.register);

router.post("/login", loginValidator, validate, authController.login);

router.post("/refresh", refreshValidator, validate, authController.refresh);

router.post("/logout", authMiddleware, authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-otp", authController.verifyOtp);

router.post("/reset-password", authController.resetPassword);

router.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);

/* GOOGLE LOGIN */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

/* FACEBOOK LOGIN */

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authController.facebookCallback
);

export default router;
