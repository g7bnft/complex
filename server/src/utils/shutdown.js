function shutdown(server, redisClient) {
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
  
      try {
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (err) {
              console.error("Error closing server:", err);
              reject(err);
            } else {
              console.log("Server closed.");
              resolve();
            }
          });
        });
  
        await redisClient.quit();
        console.log("Redis connection closed.");
      } catch (err) {
        console.error("Error during shutdown:", err);
      } finally {
        process.exit(0);
      }
    });
  
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM, shutting down");
      process.exit(0);
    });
  }
  
  module.exports = shutdown;