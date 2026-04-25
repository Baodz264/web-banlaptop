import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
app.use(morgan("dev"));
}

// ================== STATIC UPLOADS ==================
// 👉 dùng path tuyệt đối cho Docker/VPS
const uploadsPath = path.join(process.cwd(), "uploads");

app.use("/uploads", express.static(uploadsPath));

// ================== HEALTH CHECK ==================
app.get("/health", (req, res) => {
return res.status(200).json({
success: true,
message: "Server is running",
});
});

// ================== ROUTES ==================
app.use("/api", routes);

// ================== 404 ==================
app.use((req, res) => {
return res.status(404).json({
success: false,
message: "Route not found",
});
});

// ================== ERROR HANDLER ==================
app.use(errorMiddleware);

export default app;
