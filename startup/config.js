import express from 'express'
const app = express();

import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { router } from '../routes/index.js'

import prepareDatabaseConnection from '../database/connection/connection.js'

dotenv.config()

const port = process.env.PORT;

export default function prepareAppStartUp() {
  prepareDatabaseConnection();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(cors({ origin: "*", methods: "GET, POST, PUT, PATCH, DELETE" }));
  app.use(express.json({ limit: "20GB" }));
  app.use(cookieParser());

  router(app);

  const Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  Server.timeout = 36000000;
};