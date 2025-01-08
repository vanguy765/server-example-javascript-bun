// src/utils/reloadConfig.ts
import { loadConfig } from './configLoader';
import { checkEnvironment } from './checkEnv';
import { logger } from './logger';

export function reloadConfig() {
  logger.info('Reloading configuration...');
  loadConfig();
  checkEnvironment();
  logger.info('Configuration reloaded successfully');
}


// // Example usage in an API route
// import { reloadConfig } from './utils/reloadConfig';

// app.post('/reload-config', (c) => {
//   reloadConfig();
//   return c.json({ message: 'Configuration reloaded successfully' });
// });