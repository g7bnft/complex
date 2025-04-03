module.exports = {
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  pgUser: process.env.PGUSER || "postgres",
  pgHost: process.env.PGHOST || "localhost",
  pgDatabase: process.env.PGDATABASE || "postgres",
  pgPassword: process.env.PGPASSWORD || "password",
  pgPort: parseInt(process.env.PGPORT || "5432", 10),
};