import type { Config } from './types/apiConfig';
import type { MigrationConfig } from "drizzle-orm/migrator";
import path from 'path';

const migrationConfig: MigrationConfig = {
  migrationsFolder: path.resolve(process.cwd(), "src/db"),
};

process.loadEnvFile();

const checkEnvVariables = () => {
  const url = process.env.DB_URL;
  const platform = process.env.PLATFORM;
  const secret = process.env.SECRET;
  const polka_key = process.env.POLKA_KEY;
  if (!url) {
    throw new Error('DB_URL environment variable is not set');
  }
  if (!platform) {
    throw new Error('PLATFORM environment variable is not set');
  }
  if (!secret) {
    throw new Error('SECRET environment variable is not set');
  }
  if (!polka_key) {
    throw new Error('POLKA_KEY environment variable is not set');
  }
  return [url, platform, secret, polka_key];
};

const [dbURL, platform, secret, polka_key] = checkEnvVariables();

export const config: Config = {
  apiConfig: {
    serverHits: 0,
    platform: platform as string,
    PORT: 8080,
    SECRET: secret as string,
    POLKA_KEY: polka_key as string,
  },
  dbConfig: {
    dbURL: dbURL as string,
    migrationConfig: migrationConfig,
  },
};
