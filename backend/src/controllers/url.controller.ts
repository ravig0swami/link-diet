import type { Request, Response, NextFunction } from "express";
import { createUrlSchema } from "../validators/url.validator.js";
import { UrlService } from "../services/url.service.js";
import { env } from "../config/env.js";

export async function createUrlHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate request body
    const parseResult = createUrlSchema.safeParse({ body: req.body });
    
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: firstError.message,
        }
      });
      return;
    }

    const { originalUrl, customAlias } = parseResult.data.body;

    // Call service to handle business logic
    const newUrl = await UrlService.createShortUrl({
      originalUrl,
      customAlias,
    });

    // Return standardized response
    res.status(201).json({
      success: true,
      data: {
        id: newUrl.id,
        shortCode: newUrl.short_code,
        shortUrl: `${env.SHORT_URL_BASE}/${newUrl.short_code}`,
        originalUrl: newUrl.original_url,
        clickCount: newUrl.click_count,
        createdAt: newUrl.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}
