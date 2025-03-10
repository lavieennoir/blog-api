declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_TITLE: string;
      API_VERSION: string;
      ENABLE_DOCS: string;
      BASE_URL: string;
      DATABASE_URL: string;
      PORT: string;
      JWT_SECRET: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

export {};
