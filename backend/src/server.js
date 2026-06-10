import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/repository", repositoryRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Electrical & Computer Project Repository Hub backend running on port ${port}`);
});
