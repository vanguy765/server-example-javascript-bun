// src/utils/checkEnv.ts
import { loadConfig, getConfig } from './configLoader';
import { logger } from './logger';

/**
 * Checks the environment configuration and logs the current settings.
 * Validates certain configuration settings to ensure they are correct.
 * Logs warnings or throws errors if any configuration issues are detected.
 *
 * @throws {Error} If DEFAULT_PAGE_SIZE is greater than MAX_PAGE_SIZE.
 */
export function checkEnvironment() {
  const config = getConfig();

  logger.info('Environment configuration:', {
    nodeEnv: config.NODE_ENV,
    port: config.PORT,
    dbHost: config.DB_HOST,
    dbName: config.DB_NAME,
    apiPrefix: config.MY_API_PREFIX,
    logLevel: config.LOG_LEVEL
  });

  // Check database connection string
  const dbUrlValid = config.DATABASE_URL.includes(config.DB_HOST) && 
                    config.DATABASE_URL.includes(config.DB_NAME);
  
  if (!dbUrlValid) {
    logger.warn('DATABASE_URL might not match DB_HOST and DB_NAME');
  }

  // Check pagination settings
  if (config.DEFAULT_PAGE_SIZE > config.MAX_PAGE_SIZE) {
    throw new Error('DEFAULT_PAGE_SIZE cannot be greater than MAX_PAGE_SIZE');
  }

  logger.info('✅ Environment check completed');
}