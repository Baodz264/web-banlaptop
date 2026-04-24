import { body } from "express-validator";

export const createMessageValidator = [
  body("chat_id")
    .trim()
    .notEmpty()
    .withMessage("Chat ID không được để trống")
    .isMongoId()
    .withMessage("Chat id không hợp lệ"),

  body("sender_id")
    .trim()
    .notEmpty()
    .withMessage("Sender ID không được để trống")
    .isInt()
    .withMessage("Sender ID phải là số")
    .toInt(),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Tin nhắn tối đa 2000 ký tự")
    .escape(),

  body("message_type")
    .optional()
    .trim()
    .isIn(["text", "image", "icon", "file", "system"])
    .withMessage("Loại tin nhắn không hợp lệ"),
];

export const updateMessageValidator = [
  body("message")
    .optional()
    .trim()
    .isString()
    .withMessage("Tin nhắn phải là chuỗi")
    .isLength({ max: 2000 })
    .withMessage("Tin nhắn tối đa 2000 ký tự")
    .escape(),

  body("message_type")
    .optional()
    .trim()
    .isIn(["text", "image", "icon", "file", "system"])
    .withMessage("Loại tin nhắn không hợp lệ"),
];
