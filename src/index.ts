import { PORT } from './config.js';
import express from 'express';
import { readinessHandler } from './routes/readinessHandler.js';
import { middlewareLogResponses } from './middlewares.js';

const app = express();

app.use("/app", express.static("./src/app"));

app.get('/healthz', readinessHandler);

app.use(middlewareLogResponses);
app.listen(PORT, () => {
  console.log('Server is running on port http://localhost:8080');
});
