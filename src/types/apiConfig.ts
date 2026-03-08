import type { MigrationConfig } from "drizzle-orm/migrator";

export type APIConfig = {
  serverHits: number;
  platform: string;
  PORT: number;
};

export type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

export type Config = {
  apiConfig: APIConfig;
  dbConfig: DBConfig;
};
