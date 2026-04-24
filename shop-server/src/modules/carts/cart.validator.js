import { body, query } from "express-validator";

export const createCartValidator = [
  body("user_id")
    .optional()
    .trim()
    .isInt()
    .withMessage("User id phải là số nguyên")
    .toInt(),

  body("session_key")
    .optional()
    .trim()
    .isString()
    .withMessage("Session key phải là chuỗi")
    .isLength({ min: 5, max: 100 })
    .withMessage("Session key phải từ 5 đến 100 ký tự")
    .escape(),
];

export const sessionCartValidator = [
  query("session_key")
    .trim()
    .notEmpty()
    .withMessage("Session key không được để trống")
    .isLength({ min: 5, max: 100 })
    .withMessage("Session key phải từ 5 đến 100 ký tự")
    .escape(),
];
