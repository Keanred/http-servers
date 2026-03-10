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
  if (!url) {
    throw new Error('DB_URL environment variable is not set');
  }
  if (!platform) {
    throw new Error('PLATFORM environment variable is not set');
  }
  return [url, platform];
};

const [dbURL, platform] = checkEnvVariables();
export const config: Config = {
  apiConfig: {
    serverHits: 0,
    platform: platform as string,
    PORT: 8080,
  },
  dbConfig: {
    dbURL: dbURL as string,
    migrationConfig: migrationConfig,
  },
};
