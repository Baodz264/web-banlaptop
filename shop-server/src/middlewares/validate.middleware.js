import { validationResult } from "express-validator";
import { BadRequestError } from "./error.middleware.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array().map((err) => err.msg).join(", ");
    throw new BadRequestError(message);
  }

  next();
};

export default validate;
