import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Token expiration time (e.g., 7 days)
const TOKEN_EXPIRATION = "7d";

// Interface for authenticated requests
export interface AuthenticatedRequest extends Request {
	isAuthenticated?: boolean;
}

// Generate a new JWT token
export const generateToken = (): string => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}
	// Since there's only one user, we don't need to store a username
	// We can just indicate that this token is valid
	return jwt.sign({ authenticated: true }, JWT_SECRET, {
		expiresIn: TOKEN_EXPIRATION,
	});
};

// Middleware to verify JWT tokens
export const verifyToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}

	// Get token from Authorization header
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "Access denied. No token provided." });
		return;
	}

	try {
		const token = authHeader.split(" ")[1];
		// Just verify the token is valid, we don't need to extract any info
		jwt.verify(token, JWT_SECRET);

		// Mark request as authenticated
		req.isAuthenticated = true;

		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token." });
	}
};
