import { config } from './config.js';
import express from 'express';
import { readinessHandler } from './routes/readinessHandler.js';
import { metricsHandler } from './routes/metricsHandler.js';
import { resetHandler } from './routes/resetHandler.js';
import { middlewareLogResponses, middlewareMetricsInc } from './middlewares.js';

const app = express();

app.use(middlewareMetricsInc);
app.use(middlewareLogResponses);

app.use("/app", express.static("./src/app"));
app.get('/healthz', readinessHandler);
app.get('/metrics', metricsHandler);
app.post('/reset', resetHandler);


app.listen(config.PORT, () => {
  console.log(`Server is running on port http://localhost:${config.PORT}`);
});
