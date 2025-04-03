const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/postgres");
const valuesRoutes = require("./routes/values");
const { redisClient } = require("./db/redis");
const shutdown = require("./utils/shutdown");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
async function startApp() {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully.");

    // Mount routes
    app.use("/values", valuesRoutes);

    // Start server
    const server = app.listen(5000, () => {
      console.log("Listening on port 5000");
    });

    // Handle graceful shutdown
    shutdown(server, redisClient);
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApp();