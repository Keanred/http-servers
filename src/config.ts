import type { APIConfig } from './types/apiConfig';

process.loadEnvFile();

const checkEnvVariables = () => {
  const url = process.env.DB_URL;
  if (!url) {
    new Error('DB_URL environment variable is not set');
  }
  return url;
};

export const config: APIConfig = {
  serverHits: 0,
  PORT: 8080,
  dbURL: checkEnvVariables() as string,
};
