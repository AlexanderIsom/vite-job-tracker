import type { Plugin } from "vite";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

interface HtpasswdPluginOptions {
	/**
	 * Path to htpasswd file or object with username:password pairs
	 */
	credentials: string | Record<string, string>;

	/**
	 * Realm name for the authentication prompt
	 * @default 'Protected Area'
	 */
	realm?: string;

	/**
	 * Whether to bypass authentication for certain paths
	 * @default []
	 */
	exclude?: string[];
}

/**
 * Verifies if the provided password matches the htpasswd hash
 */
async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	// Basic implementation for bcrypt, md5, and plain text
	if (
		hash.startsWith("$2y$") ||
		hash.startsWith("$2a$") ||
		hash.startsWith("$2b$")
	) {
		// This is a bcrypt hash - you might want to use a bcrypt library here
		// For simplicity, we'll just return false as bcrypt requires additional libraries
		console.warn("bcrypt authentication not implemented in this simple plugin");
		return false;
	} else if (hash.startsWith("$apr1$") || hash.indexOf("$") === -1) {
		// MD5 or plain text
		if (hash.indexOf("$") === -1) {
			// Plain text comparison
			return password === hash;
		} else {
			// For MD5, we'll use a simple implementation
			const md5Hash = createHash("md5").update(password).digest("hex");
			// This is a simplified check - a real implementation would need to handle salt
			return md5Hash === hash.split("$").pop();
		}
	}

	return false;
}

/**
 * Loads credentials from an htpasswd file
 */
async function loadHtpasswdFile(
	filePath: string
): Promise<Record<string, string>> {
	try {
		const content = await fs.readFile(path.resolve(filePath), "utf-8");
		const credentials: Record<string, string> = {};

		content.split("\n").forEach((line) => {
			if (!line.trim() || line.startsWith("#")) return;

			const [username, hash] = line.split(":", 2);
			if (username && hash) {
				credentials[username] = hash;
			}
		});

		return credentials;
	} catch (error) {
		console.error(`Failed to load htpasswd file: ${error}`);
		return {};
	}
}

/**
 * Vite plugin for HTTP Basic Authentication
 */
export function viteHtpasswd(options: HtpasswdPluginOptions): Plugin {
	let credentials: Record<string, string> = {};

	return {
		name: "vite-plugin-htpasswd",
		configureServer: async (server) => {
			// Load credentials
			if (typeof options.credentials === "string") {
				credentials = await loadHtpasswdFile(options.credentials);
			} else {
				credentials = options.credentials;
			}

			// No credentials, no authentication
			if (Object.keys(credentials).length === 0) {
				console.warn("No valid credentials found, authentication disabled");
				return;
			}

			server.middlewares.use(async (req, res, next) => {
				// Skip authentication for excluded paths
				if (options.exclude?.some((path) => req.url?.startsWith(path))) {
					return next();
				}

				const authHeader = req.headers.authorization;

				if (!authHeader || !authHeader.startsWith("Basic ")) {
					// No auth header, request authentication
					res.statusCode = 401;
					res.setHeader(
						"WWW-Authenticate",
						`Basic realm="${options.realm || "Protected Area"}"`
					);
					res.end("Authentication required");
					return;
				}

				// Decode credentials
				const base64Credentials = authHeader.split(" ")[1];
				const [username, password] = Buffer.from(base64Credentials, "base64")
					.toString("utf-8")
					.split(":", 2);

				// Verify credentials
				const storedHash = credentials[username];
				if (!storedHash || !(await verifyPassword(password, storedHash))) {
					res.statusCode = 401;
					res.setHeader(
						"WWW-Authenticate",
						`Basic realm="${options.realm || "Protected Area"}"`
					);
					res.end("Invalid credentials");
					return;
				}

				// Authentication successful
				next();
			});
		},
	};
}

export default viteHtpasswd;
