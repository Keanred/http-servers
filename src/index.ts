import express from 'express';
import { readinessHandler } from './routes/readinessHandler.js';
import { middlewareLogResponses, middlewareMetricsInc } from './middlewares.js';
import { metricsHandler } from './routes/metricsHandler.js';
import { resetHandler } from './routes/resetHandler.js';
import { config } from './config.js';

const app = express();

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get('/api/healthz', readinessHandler);
app.get('/api/metrics', metricsHandler);
app.get('/api/reset', resetHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.PORT}`);
});
