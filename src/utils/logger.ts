// src/utils/logger.ts
export const logger = {
    debug: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔍 DEBUG:', message, data || '');
      }
    },
    info: (message: string, data?: any) => {
      console.log('ℹ️ INFO:', message, data || '');
    },
    warn: (message: string, data?: any) => {
      console.warn('⚠️ WARN:', message, data || '');
    },
    error: (message: string, error?: any) => {
      console.error('❌ ERROR:', message, error || '');
    }
  };