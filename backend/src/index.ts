import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { uploadsRouter } from "./routes/uploads.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser / same-origin tools send no Origin header
      if (!origin) {
        callback(null, true);
        return;
      }
      if (env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // Local Next.js often hops ports (3000 ↔ 3001) when one is busy
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "clipforge-backend" });
});

app.use("/auth", authRouter);
app.use("/uploads", uploadsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(`ClipForge API listening on http://localhost:${env.port}`);
});
