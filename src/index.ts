import express from 'express';
import { readinessHandler } from './routes/readinessHandler.js';
import { middlewareLogResponses, middlewareMetricsInc } from './middlewares.js';
import { metricsHandler } from './routes/metricsHandler.js';
import { resetHandler } from './routes/resetHandler.js';
import { config } from './config.js';
import { validateHandler } from './routes/validateHandler.js';

const app = express();
app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get('/api/healthz', readinessHandler);
app.post('/api/validate_chirp', validateHandler);
app.get('/admin/metrics', metricsHandler);
app.post('/admin/reset', resetHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.PORT}`);
});
