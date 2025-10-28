// src/app.ts
import express from "express";
import deviceRoutes from "./routes/deviceRoutes";
import dotenv from "dotenv";
import downloadRoutes from "./routes/downloadRoutes";
import { swaggerUiHandler, swaggerUiSetup } from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());

// route register
app.use("/api/device", deviceRoutes);

// Swagger docs endpoint
app.use("/api-docs", swaggerUiHandler, swaggerUiSetup);

// route untuk media
app.use("/api/media", downloadRoutes);

export default app;
