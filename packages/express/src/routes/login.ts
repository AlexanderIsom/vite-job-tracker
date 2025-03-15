// src/routes/user.ts
import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { generateToken } from "../auth/jwtAuth";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const { password } = req.body;

	// Validate password against environment variable
	if (password === process.env.ADMIN_PASSWORD) {
		// Generate JWT token
		const token = generateToken();

		// Return token
		res.json({
			success: true,
			token,
		});
	} else {
		res.status(401).json({
			success: false,
			message: "Invalid password",
		});
	}
});

export default router;
