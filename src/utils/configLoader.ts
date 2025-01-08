// src/utils/configLoader.ts
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.number(),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  MY_API_PREFIX: z.string(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  DEFAULT_PAGE_SIZE: z.number(),
  MAX_PAGE_SIZE: z.number(),
  API_KEY: z.string().optional(),
  AUTH_SECRET: z.string().optional()
});

let config = configSchema.parse(process.env);

export function loadConfig() {
  config = configSchema.parse(process.env);
  return config;
}

export function getConfig() {
  return config;
}