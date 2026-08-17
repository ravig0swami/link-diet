import { supabase } from "../config/supabase.js";
import { AppError } from "../types/index.js";
import { generateShortCode } from "../utils/generate.js";

interface CreateUrlParams {
  originalUrl: string;
  customAlias?: string;
  userId?: string;
}

export class UrlService {
  /**
   * Creates a short URL with collision handling for generated codes.
   */
  static async createShortUrl(params: CreateUrlParams) {
    const { originalUrl, customAlias, userId } = params;

    if (customAlias) {
      // For custom alias, we attempt a single insert and handle duplicates
      return this.insertUrlRecord({
        original_url: originalUrl,
        short_code: customAlias,
        custom_alias: customAlias,
        user_id: userId,
      });
    }

    // For generated codes, retry up to 3 times in case of collisions
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const generatedCode = generateShortCode(6);
      try {
        return await this.insertUrlRecord({
          original_url: originalUrl,
          short_code: generatedCode,
          user_id: userId,
        });
      } catch (error) {
        if (error instanceof AppError && error.code === "ALIAS_TAKEN" && attempt < maxRetries) {
          // It's a collision on a randomly generated code; retry
          continue;
        }
        throw error;
      }
    }

    throw new AppError(500, "GENERATION_FAILED", "Failed to generate a unique short code. Please try again.");
  }

  private static async insertUrlRecord(record: {
    original_url: string;
    short_code: string;
    custom_alias?: string;
    user_id?: string;
  }) {
    const { data, error } = await supabase
      .from("urls")
      .insert([record])
      .select()
      .single();

    if (error) {
      // 23505 is the PostgreSQL error code for unique_violation
      if (error.code === "23505") {
        throw new AppError(409, "ALIAS_TAKEN", "The provided alias or generated code is already in use.");
      }
      throw new AppError(500, "DATABASE_ERROR", "Failed to save URL to database.");
    }

    return data;
  }

  /**
   * Looks up the original URL by short code and asynchronously increments the click count.
   * Returns null if not found.
   */
  static async getOriginalUrl(shortCode: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("urls")
      .select("original_url, click_count")
      .eq("short_code", shortCode)
      .single();

    if (error || !data) {
      return null;
    }

    // Fire and forget the click count increment
    supabase
      .from("urls")
      .update({ click_count: data.click_count + 1 })
      .eq("short_code", shortCode)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error(`Failed to increment click count for ${shortCode}:`, updateError);
        }
      });

    return data.original_url;
  }
}
