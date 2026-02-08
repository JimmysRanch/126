import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectRouter } from "./routes/connect.js";
import { terminalRouter } from "./routes/terminal.js";
import { webhookRouter } from "./routes/webhook.js";

const app = express();
const PORT = Number(process.env.PORT || 4242);

app.use(cors({ origin: process.env.APP_BASE_URL || "http://localhost:5173", credentials: true }));

// Webhook MUST be before express.json because it needs raw body for signature verification
app.use("/api/stripe", webhookRouter);

// JSON routes
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/stripe/connect", connectRouter);
app.use("/api/stripe/terminal", terminalRouter);

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
