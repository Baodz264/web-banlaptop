import { body } from "express-validator";

export const updateLocationValidator = [

  body("shipment_id")
    .notEmpty()
    .withMessage("shipment_id không được để trống")
    .isInt()
    .withMessage("shipment_id phải là số"),

  body("latitude")
    .notEmpty()
    .withMessage("latitude không được để trống")
    .isFloat()
    .withMessage("latitude phải là số"),

  body("longitude")
    .notEmpty()
    .withMessage("longitude không được để trống")
    .isFloat()
    .withMessage("longitude phải là số")

];
