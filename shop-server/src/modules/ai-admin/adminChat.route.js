import express from "express";
import { adminChatController } from "./adminChat.controller.js";
import {
  exportOrders,
  exportTopSelling,
} from "./admin.export.controller.js";

const router = express.Router();

// ================= AI CHAT =================
router.post("/chat", adminChatController);

// ================= EXPORT EXCEL =================
router.get("/export/orders", exportOrders);
router.get("/export/top-selling", exportTopSelling);

export default router;
