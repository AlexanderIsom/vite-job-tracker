// src/index.ts
import "dotenv/config";
import express from "express";
import jobsRouter from "./routes/jobs";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

//CORS
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

// Routes
app.use("/jobs", jobsRouter);

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
