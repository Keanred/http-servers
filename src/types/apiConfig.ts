import type { MigrationConfig } from "drizzle-orm/migrator";

export type APIConfig = {
  serverHits: number;
  platform: string;
  PORT: number;
  SECRET: string;
  POLKA_KEY: string;
};

export type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

export type Config = {
  apiConfig: APIConfig;
  dbConfig: DBConfig;
};
