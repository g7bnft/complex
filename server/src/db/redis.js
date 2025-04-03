const Redis = require("ioredis");
const config = require("../config");

const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  retryStrategy: () => 5000,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = {
  redisClient,
};