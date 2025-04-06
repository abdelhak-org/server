import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { productsRouter } from "./routes/productsRoute.js";
import { usersRouter } from "./routes/usersRoute.js";
import { getConfig } from "./config.js";

const app = express();
mongoose
  .connect(getConfig().MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
app.use(helmet());

app.use(
  cors({
    origin: getConfig().CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize());
app.use(xss());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use("/api/v1", limiter);

app.get("/api/v1", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);

app.listen(getConfig().SERVER_PORT, () => {
  console.log(`Server is running on port ${getConfig().SERVER_PORT}`);
});
