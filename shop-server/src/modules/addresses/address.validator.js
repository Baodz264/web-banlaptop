import { body } from "express-validator";

export const createAddressValidator = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Họ và tên không được để trống")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa 150 ký tự")
    .escape(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .isMobilePhone("any")
    .withMessage("Số điện thoại không hợp lệ"),

  body("province")
    .trim()
    .notEmpty()
    .withMessage("Tỉnh/Thành phố không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tỉnh/Thành phố tối đa 100 ký tự")
    .escape(),

  body("district")
    .trim()
    .notEmpty()
    .withMessage("Quận/Huyện không được để trống")
    .isLength({ max: 100 })
    .withMessage("Quận/Huyện tối đa 100 ký tự")
    .escape(),

  body("ward")
    .trim()
    .notEmpty()
    .withMessage("Phường/Xã không được để trống")
    .isLength({ max: 100 })
    .withMessage("Phường/Xã tối đa 100 ký tự")
    .escape(),

  body("address_detail")
    .trim()
    .notEmpty()
    .withMessage("Địa chỉ chi tiết không được để trống")
    .isLength({ max: 255 })
    .withMessage("Địa chỉ chi tiết tối đa 255 ký tự")
    .escape(),
];

export const updateAddressValidator = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa 150 ký tự")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Số điện thoại không hợp lệ"),

  body("province")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tỉnh/Thành phố tối đa 100 ký tự")
    .escape(),

  body("district")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Quận/Huyện tối đa 100 ký tự")
    .escape(),

  body("ward")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Phường/Xã tối đa 100 ký tự")
    .escape(),

  body("address_detail")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Địa chỉ chi tiết tối đa 255 ký tự")
    .escape(),
];
