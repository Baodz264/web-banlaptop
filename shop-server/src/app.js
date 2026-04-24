import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();


app.use(cors());


app.use(express.json({ limit: "10mb" }));


app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}



app.use("/uploads", express.static("uploads"));



app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});



app.use("/api", routes);


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



app.use(errorMiddleware);

export default app;
