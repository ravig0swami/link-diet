import type { Request, Response, NextFunction } from "express";
import { AppError } from "../types/index.js";
import { env } from "../config/env.js";

/** Centralized error handling middleware */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Log unexpected errors
  console.error("Unhandled error:", err);

  // Hide stack traces in production
  const message =
    env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message || "An unexpected error occurred";

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
  });
}

/** 404 handler for unmatched routes */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
