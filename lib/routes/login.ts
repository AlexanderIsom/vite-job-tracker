import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { generateToken } from "../auth/jwtAuth";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const { password } = req.body;

	if (password === process.env.ADMIN_PASSWORD) {
		const token = generateToken();

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
