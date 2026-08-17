import { Router } from "express";
import { createUrlHandler } from "../controllers/url.controller.js";

const router = Router();

router.post("/", createUrlHandler);

export default router;
