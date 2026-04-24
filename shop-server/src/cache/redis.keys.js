import crypto from "crypto";

const normalizeMessage = (msg = "") => {
  return msg
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 500); // tránh input quá dài
};

export const CacheKeys = {
  AI_CHAT: (userId, msg) => {
    const normalized = normalizeMessage(msg);
    const hash = crypto.createHash("md5").update(normalized).digest("hex");

    return `v1:ai:${userId}:${hash}`;
  },

  PRODUCT: (id) => `v1:product:${id}`,

  USER: (id) => `v1:user:${id}`,

  SEARCH: (query) => {
    const normalized = normalizeMessage(query);
    const hash = crypto.createHash("md5").update(normalized).digest("hex");

    return `v1:search:${hash}`;
  },
};
