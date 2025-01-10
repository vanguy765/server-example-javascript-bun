// src/config/env.config.ts

const path = require('path');
import { findUp } from 'find-up';

async function getRootDir() {
  const packageJsonPath = await findUp('package.json');
  if (!packageJsonPath) {
    throw new Error('Could not find package.json');
  }
  return path.dirname(packageJsonPath);
}



export const envConfig = {
  weather: {
    baseUrl:
      process.env.WEATHER_BASE_URL ?? `https://api.openweathermap.org/data/2.5`,
    apiKey: process.env.WEATHER_API_KEY ?? ``,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? ``,
  },
  vapi: {
    baseUrl: process.env.VAPI_BASE_URL ?? "https://api.vapi.ai",
    apiKey: process.env.VAPI_API_KEY ?? "",
  },
  demo: {
    phoneNumber: process.env.DEMO_PHONE_NUMBER ?? "",
    agentType: process.env.DEMO_AGENT_TYPE ?? "",
    agentDir: process.env.DEMO_AGENT_DIR ?? "",
  },
  utils: {
    rootDir: getRootDir(),
    defaultAgentDir: process.env.DEFAULT_AGENT_DIR ?? "",
  },
};
