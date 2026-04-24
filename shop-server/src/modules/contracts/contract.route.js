import express from "express";
import ContractController from "./contract.controller.js";

import {
  createContractValidator,
  updateContractValidator
} from "./contract.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadContract = createUploader("contracts");

router.get("/", ContractController.getContracts);

router.get("/:id", ContractController.getContractById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff"),
  uploadContract.single("file"),
  createContractValidator,
  validate,
  ContractController.createContract
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  uploadContract.single("file"),
  updateContractValidator,
  validate,
  ContractController.updateContract
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  ContractController.deleteContract
);

export default router;
