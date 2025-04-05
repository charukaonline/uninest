const Redis = require("ioredis");
const { promisify } = require("util");

// Create Redis client
const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Promisify some Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);

module.exports = {
  redisClient,
  getAsync,
  setAsync,
  delAsync,
  expireAsync,
};
