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
    webhookServer: process.env.VAPI_WEBHOOK_SERVER ?? "",
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    key: process.env.SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
};
