import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.js";

const router = Router();

router.get("/db-test", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Attempt to query the urls table to verify connection
    const { data, error } = await supabase
      .from("urls")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Database connection error:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Successfully connected to Supabase Database",
      data,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
