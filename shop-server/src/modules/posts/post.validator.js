import { body } from "express-validator";

export const createPostValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Tiêu đề không được để trống")
    .isLength({ max: 255 })
    .withMessage("Tiêu đề tối đa 255 ký tự")
    .escape(),

  body("slug")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Slug tối đa 255 ký tự")
    .isSlug()
    .withMessage("Slug phải là dạng URL hợp lệ"),

  body("content")
    .optional()
    .trim(),

  body("topic_id")
    .optional()
    .isInt()
    .withMessage("Topic id phải là số")
    .toInt(),

  body("thumbnail")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Thumbnail tối đa 255 ký tự"),
];

export const updatePostValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tiêu đề tối đa 255 ký tự")
    .escape(),

  body("slug")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Slug tối đa 255 ký tự")
    .isSlug()
    .withMessage("Slug phải là dạng URL hợp lệ"),

  body("content")
    .optional()
    .trim(),

  body("topic_id")
    .optional()
    .isInt()
    .withMessage("Topic id phải là số")
    .toInt(),

  body("thumbnail")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Thumbnail tối đa 255 ký tự"),
];
