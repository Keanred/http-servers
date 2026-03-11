import express from 'express';
import { readiness } from './routes/readiness';
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from './middlewares';
import { metrics } from './routes/metrics';
import { reset } from './routes/reset';
import { config } from './config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { createNewUser, updateExistingUser } from './routes/users';
import { createChirp, getChirps, getChirp, deleteChirp } from './routes/chirps';
import { login } from './routes/login';
import { refreshToken } from './routes/refresh';
import { revokeToken } from './routes/revoke';

const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

const app = express();
app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get('/api/healthz', readiness);
app.post('/api/users', createNewUser);
app.put('/api/users', updateExistingUser);
app.get('/api/chirps', getChirps);
app.get('/api/chirps/:id', getChirp);
app.delete('/api/chirps/:id', deleteChirp);
app.post('/api/chirps', createChirp);
app.post('/api/login', login);
app.post('/api/refresh', refreshToken);
app.post('/api/revoke', revokeToken);
app.get('/admin/metrics', metrics);
app.post('/admin/reset', reset);

app.use(errorHandler);

app.listen(config.apiConfig.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.apiConfig.PORT}`);
});
