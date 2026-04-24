import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },

  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Redis connected ✅");
});

redis.on("ready", () => {
  console.log("Redis ready 🚀");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting 🔄");
});

redis.on("error", (err) => {
  console.error("Redis error ❌:", err.message);
});

redis.on("end", () => {
  console.log("Redis connection closed ⚠️");
});

// graceful shutdown
process.on("SIGINT", async () => {
  try {
    await redis.quit();
    console.log("Redis disconnected gracefully 👋");
  } catch (err) {
    console.error("Redis shutdown error:", err.message);
  }
});

export default redis;
