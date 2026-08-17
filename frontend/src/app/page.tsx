"use client";

import { useEffect, useState } from "react";
import { Link2, Zap, Shield, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );

  useEffect(() => {
    async function checkHealth() {
      const health = await api.checkHealth();
      setApiStatus(health?.success ? "connected" : "error");
    }
    checkHealth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary">
              <Link2 className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">LinkDiet</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {apiStatus === "loading" && (
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-muted-foreground animate-pulse" />
                Connecting...
              </span>
            )}
            {apiStatus === "connected" && (
              <span className="text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                API Connected
              </span>
            )}
            {apiStatus === "error" && (
              <span className="text-destructive flex items-center gap-1.5">
                <XCircle className="size-3.5" />
                API Offline
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="size-3.5 text-amber-400" />
            Fast, modern URL shortener
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              Short links.
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/70 to-muted-foreground bg-clip-text text-transparent">
                Less clutter.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Paste your long URL and create a short, shareable link in seconds. 
              Simple, fast, and free.
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium px-3">URL Shortener — Coming in Phase 5</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="h-12 rounded-lg border border-dashed border-border/80 bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
              [ Enter your long URL here... ]
            </div>
            <div className="h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm text-primary font-medium">
              Create Short Link
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: Link2, label: "Custom aliases" },
              { icon: BarChart3, label: "Click tracking" },
              { icon: Shield, label: "Secure & validated" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-card/30 px-4 py-2 text-muted-foreground"
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2025 LinkDiet</span>
          <span className="font-mono text-xs">v1.0.0-dev</span>
        </div>
      </footer>
    </div>
  );
}
