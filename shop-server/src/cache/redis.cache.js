import redis from "../config/redis.config.js";

export const getCache = async (key) => {
  if (!key) return null;

  try {
    const data = await redis.get(key);
    if (!data) return null;

    return JSON.parse(data);
  } catch (err) {
    console.error("[Redis][getCache] error:", err.message);
    return null;
  }
};

export const setCache = async (key, value, ttl = 300) => {
  if (!key) return;

  try {
    const data = JSON.stringify(value);

    if (ttl) {
      await redis.setex(key, ttl, data);
    } else {
      await redis.set(key, data);
    }
  } catch (err) {
    console.error("[Redis][setCache] error:", err.message);
  }
};

export const deleteCache = async (key) => {
  try {
    if (!key) return;
    await redis.del(key);
  } catch (err) {
    console.error("[Redis][deleteCache] error:", err.message);
  }
};
