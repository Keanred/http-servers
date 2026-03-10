import express from 'express';
import { readiness } from './routes/readiness';
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from './middlewares';
import { metrics } from './routes/metrics';
import { reset } from './routes/reset';
import { config } from './config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { createNewUser } from './routes/users';
import { createChirp, getChirps, getChirp } from './routes/chirps';
import { login } from './routes/login';

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
app.post('/api/login', login);
app.get('/admin/metrics', metrics);
app.post('/admin/reset', reset);

app.use(errorHandler);

app.listen(config.apiConfig.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.apiConfig.PORT}`);
});
