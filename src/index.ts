import express from 'express';
import { readiness } from './routes/readiness.js';
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from './middlewares.js';
import { metrics } from './routes/metrics.js';
import { reset } from './routes/reset.js';
import { config } from './config.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { createNewUser } from './routes/users.js';
import { createChirp, getChirps, getChirp } from './routes/chirps.js';

const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

const app = express();
app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get('/api/healthz', readiness);
app.post('/api/users', createNewUser);
app.get('/api/chirps', getChirps);
app.get('/api/chirps/:id', getChirp);
app.post('/api/chirps', createChirp);
app.get('/admin/metrics', metrics);
app.post('/admin/reset', reset);

app.use(errorHandler);

app.listen(config.apiConfig.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.apiConfig.PORT}`);
});
