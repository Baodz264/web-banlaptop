import { ENV } from "../config/env";

export const getImageUrl = (path) => {
  if (!path) return null;
  return `${ENV.BASE_URL}${path}`;
};
