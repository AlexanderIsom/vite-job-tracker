import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import { verifyToken } from "./auth/jwtAuth";
import loginRouter from "./routes/login";
import jobsRouter from "./routes/jobs";
import industryTagsRouter from "./routes/industry-tags";
import stackTagsRouter from "./routes/stack-tags";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth/login", loginRouter);

app.use("/api", verifyToken);

app.use("/api/jobs", jobsRouter);
app.use("/api/industry-tags", industryTagsRouter);
app.use("/api/stack-tags", stackTagsRouter);

const PORT = +(process.env.PORT || 3000);

ViteExpress.listen(app, PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
