import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import config from "./config";

import reqLogger from "./utils/reqLogger";
import {CustomRequest} from "../src/utils/interface";
dotenv.config();

const app = express();
const port = config.PORT || 5000;

app.use(cors());
app.use(express.json());

declare global {
  namespace Express {
    interface Request extends CustomRequest {}
  }
}

app.use(reqLogger) // request logger
app.use("/api/v1", router);



app.get("/", (req, res) => {
  res.send("Welcome to Revie Housing inc");
});

// Global 404 error handler
app.use((req, res, next) => res.status(404).send({
  status: "error",
  error: "Not found",
  message: "This is not the route you're looking for. You messed up",
}));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode || err.statusCode === 500) {
    config.logger.error(`
      Error caught at ${req.path}, 
      Request body: ${JSON.stringify(req.body)},
      Request User: ${JSON.stringify(req.user)},
      Request Params: ${JSON.stringify(req.params)}
      Request Query: ${JSON.stringify(req.query)}
      Error Message: ${JSON.stringify(err.message)}
      Error Logs: ${JSON.stringify(err.stack)}
  }`);
  }
  return res.status(err.statusCode).send(err.error);
});

app.listen(port, () => {
  console.log(`Server Running on: ${port}`);
});

export default app;
