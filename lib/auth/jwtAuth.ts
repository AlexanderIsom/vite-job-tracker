import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_EXPIRATION = "7d";

export interface AuthenticatedRequest extends Request {
	isAuthenticated?: boolean;
}

export const generateToken = (): string => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}

	return jwt.sign({ authenticated: true }, JWT_SECRET, {
		expiresIn: TOKEN_EXPIRATION,
	});
};

export const verifyToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}

	const token = req.cookies["auth_token"];

	try {
		jwt.verify(token, JWT_SECRET);

		req.isAuthenticated = true;

		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token." });
	}
};
