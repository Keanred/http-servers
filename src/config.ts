import type { Config } from './types/apiConfig';
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();

const checkEnvVariables = () => {
  const url = process.env.DB_URL;
  if (!url) {
    new Error('DB_URL environment variable is not set');
  }
  return url;
};

export const config: Config = {
  apiConfig: {
    serverHits: 0,
    PORT: 8080,
  },
  dbConfig: {
    dbURL: checkEnvVariables() as string,
    migrationConfig: migrationConfig,
  },
};
