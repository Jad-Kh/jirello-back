import express from 'express';
const app = express();

import helmet from 'helmet'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import { router } from '../routes/index.js'

import prepareDatabaseConnection from '../database/connection/connection.js'

dotenv.config()

const port = 8082;

export default function prepareAppStartUp(): void {
    prepareDatabaseConnection();

    app.use(helmet());
    app.use(cors({ origin: "*", methods: "GET, POST, PUT, PATCH, DELETE" }));
    app.use(express.json({ limit: "20GB" }));
    app.use(cookieParser());

    router(app);

    const Server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    Server.timeout = 36000000;
};