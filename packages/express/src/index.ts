// src/index.ts
import "dotenv/config";
import express from "express";
import jobsRouter from "./routes/jobs";
import loginRouter from "./routes/login";

import cors from "cors";
import { verifyToken } from "./auth/jwtAuth";

const app = express();

// Middleware
app.use(express.json());

//CORS
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
	})
);

app.use("/auth/login", loginRouter);

app.use("/api", verifyToken);

// Routes
app.use("/api/jobs", jobsRouter);

// Start server
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
