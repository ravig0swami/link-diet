import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import apiRouter from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/v1", apiRouter);

// Error handling (must be registered after routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
