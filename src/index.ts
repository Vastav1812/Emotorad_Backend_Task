import { config } from "./config";
import { logger } from "./utils/logger";
import { app, initializeApp } from "./app";

async function startServer() {
  try {
    await initializeApp();

    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
