import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Server is running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
