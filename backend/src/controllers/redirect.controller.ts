import type { Request, Response, NextFunction } from "express";
import { UrlService } from "../services/url.service.js";
import { AppError } from "../types/index.js";

export async function redirectHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { shortCode } = req.params;

    // Check if it's an API route falling through, prevent redirecting it
    if (shortCode === "api") {
      next();
      return;
    }

    const originalUrl = await UrlService.getOriginalUrl(shortCode);

    if (!originalUrl) {
      // If no URL is found, return 404
      throw new AppError(404, "NOT_FOUND", "The requested short link does not exist or has been deleted.");
    }

    // 302 Found — Prevents aggressive caching to keep analytics accurate
    res.redirect(302, originalUrl);
  } catch (error) {
    next(error);
  }
}
