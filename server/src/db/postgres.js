const { Pool } = require("pg");
const config = require("../config");

const pgPool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort,
});


const maxRetries = 5; // Maximum number of retries
const retryInterval = 2000; // Retry every 3 seconds

async function initializeDatabase(retryCount = 0) {
  try {
    console.log("Attempting to connect to PostgreSQL...");
    await pgPool.query("CREATE TABLE IF NOT EXISTS values (number INT)");
    console.log(
      "PostgreSQL connection successful and table created (if needed)."
    );
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err);
    if (retryCount < maxRetries) {
      console.log(
        `Retrying in ${retryInterval / 1000} seconds... (Attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      await initializeDatabase(retryCount + 1); // Recursive call to retry
    } else {
      console.error("Max retries reached.  Failed to connect to PostgreSQL.");
      // Optionally, you might want to terminate the application here
      process.exit(1); // Exit with an error code
    }
  }
}


module.exports = {
  pgPool,
  initializeDatabase,
};