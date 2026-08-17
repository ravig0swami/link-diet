import { Router } from "express";
import healthRouter from "./health.routes.js";
import dbTestRouter from "./db-test.routes.js";

const router = Router();

// Mount sub-routers
router.use("/", healthRouter);
router.use("/", dbTestRouter);

export default router;
