import { Request, Response } from "express";
import { config } from "../config.js";

export const metricsHandler = (req: Request, res: Response) => {
  res.status(200).set("Content-Type", "text/html; charset=utf8").send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.serverHits} times!</p>
  </body>
</html>`);
};
