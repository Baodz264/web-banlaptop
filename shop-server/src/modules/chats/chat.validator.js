import { body } from "express-validator";

export const createChatValidator = [
  body("customer_id")
    .notEmpty()
    .withMessage("Customer id không được để trống")
    .isInt()
    .withMessage("Customer id phải là số")
    .toInt(),

  body("admin_id")
    .notEmpty()
    .withMessage("Admin id không được để trống")
    .isInt()
    .withMessage("Admin id phải là số")
    .toInt(),
];
