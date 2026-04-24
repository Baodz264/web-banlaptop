import { body } from "express-validator";

export const registerValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2 đến 50 ký tự")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .isLength({ max: 100 })
    .withMessage("Email tối đa 100 ký tự")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 8, max: 50 })
    .withMessage("Mật khẩu phải từ 8 đến 50 ký tự")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/[a-z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ thường")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải có ít nhất 1 số")
    .matches(/[!@#$%^&*]/)
    .withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
];

export const loginValidator = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];

export const refreshValidator = [

  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token không được để trống")
    .isJWT()
    .withMessage("Refresh token phải là JWT hợp lệ"),
];
export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
];

export const resetPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("otp")
    .notEmpty()
    .withMessage("OTP không được để trống")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP phải 6 số"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải >= 8 ký tự"),
];
