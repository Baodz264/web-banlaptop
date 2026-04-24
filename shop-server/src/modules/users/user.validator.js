import { body } from "express-validator";

export const createUserValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ max: 150 })
    .withMessage("Tên không được vượt quá 150 ký tự")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6, max: 100 })
    .withMessage("Mật khẩu phải từ 6 đến 100 ký tự"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Số điện thoại không hợp lệ"),

  body("role")
    .optional()
    .isIn(["admin", "staff", "customer", "shipper"])
    .withMessage("Role không hợp lệ"),
];


export const updateUserValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên không được vượt quá 150 ký tự")
    .escape(),

  body("password")
    .optional()
    .isLength({ min: 6, max: 100 })
    .withMessage("Mật khẩu phải từ 6 đến 100 ký tự"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Số điện thoại không hợp lệ"),

  body("role")
    .optional()
    .isIn(["admin", "customer", "shipper"])
    .withMessage("Role không hợp lệ"),
];


export const updateProfileValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên không được vượt quá 150 ký tự")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Số điện thoại không hợp lệ"),
];
