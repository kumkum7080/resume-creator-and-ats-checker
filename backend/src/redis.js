const Redis = require("ioredis");

const globalForRedis = global;

const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    lazyConnect: true, // Gracefully handle if local Redis is down
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

module.exports = { redis };
