import { z } from "zod";

const RESERVED_ALIASES = [
  "api",
  "login",
  "signup",
  "dashboard",
  "settings",
  "admin",
  "health",
  "docs",
];

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string({ required_error: "originalUrl is required" })
      .url("Invalid URL format")
      .refine((url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }, "Only http and https protocols are allowed"),

    customAlias: z
      .string()
      .min(3, "Custom alias must be at least 3 characters")
      .max(30, "Custom alias must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "Custom alias can only contain letters, numbers, hyphens, and underscores"
      )
      .refine(
        (alias) => !RESERVED_ALIASES.includes(alias.toLowerCase()),
        "This custom alias is reserved"
      )
      .optional(),
  }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>["body"];
