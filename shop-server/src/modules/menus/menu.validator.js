import { body } from "express-validator";

// ================= CREATE =================
export const createMenuValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên menu không được để trống")
    .isLength({ min: 1, max: 150 })
    .withMessage("Tên menu phải từ 1 đến 150 ký tự")
    .escape(),

  body("link")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Liên kết tối đa 255 ký tự"),

  // ✅ FIX parent_id
  body("parent_id")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === "") return true;
      if (!Number.isInteger(Number(value))) {
        throw new Error("Parent id phải là số");
      }
      return true;
    })
    .customSanitizer((value) => {
      if (value === null || value === "") return null;
      return Number(value);
    }),

  // ✅ FIX position
  body("position")
    .optional()
    .custom((value) => {
      if (value === null || value === "") return true;
      if (!Number.isInteger(Number(value)) || Number(value) < 0) {
        throw new Error("Vị trí phải là số không âm");
      }
      return true;
    })
    .customSanitizer((value) => {
      if (value === null || value === "") return 0;
      return Number(value);
    }),
];


// ================= UPDATE =================
export const updateMenuValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên menu tối đa 150 ký tự")
    .escape(),

  body("link")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Liên kết tối đa 255 ký tự"),

  // ✅ FIX parent_id
  body("parent_id")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === "") return true;
      if (!Number.isInteger(Number(value))) {
        throw new Error("Parent id phải là số");
      }
      return true;
    })
    .customSanitizer((value) => {
      if (value === null || value === "") return null;
      return Number(value);
    }),

  // ✅ FIX position
  body("position")
    .optional()
    .custom((value) => {
      if (value === null || value === "") return true;
      if (!Number.isInteger(Number(value)) || Number(value) < 0) {
        throw new Error("Vị trí phải là số không âm");
      }
      return true;
    })
    .customSanitizer((value) => {
      if (value === null || value === "") return 0;
      return Number(value);
    }),
];
