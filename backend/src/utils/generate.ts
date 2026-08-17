import crypto from "crypto";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a random alphanumeric short code of the specified length.
 * Defaults to 6 characters.
 */
export function generateShortCode(length = 6): string {
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    // Map random byte (0-255) to our alphabet
    result += ALPHABET[randomBytes[i] % ALPHABET.length];
  }
  return result;
}
