// src/index.ts
import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import { verifyToken } from "./auth/jwtAuth";
import loginRouter from "./routes/login";
import jobsRouter from "./routes/jobs";

const app = express();

// Middleware
app.use(express.json());

app.use("/auth/login", loginRouter);

app.use("/api", verifyToken);

// Routes
app.use("/api/jobs", jobsRouter);

// Start server
const PORT = +(process.env.PORT || 3000);

ViteExpress.listen(app, PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
