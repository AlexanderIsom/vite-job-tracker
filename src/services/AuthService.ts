interface LoginResponse {
	success: boolean;
	token: string;
	message?: string;
}

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
}

class AuthService {
	private tokenKey = "auth_token";

	// Get authentication state
	getAuthState(): AuthState {
		const token = localStorage.getItem(this.tokenKey);

		return {
			isAuthenticated: !!token,
			token,
		};
	}

	// Login with just a password
	async login(
		password: string
	): Promise<{ success: boolean; message?: string }> {
		try {
			const response = await fetch("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password }),
			});

			const data: LoginResponse = await response.json();

			if (data.success && data.token) {
				localStorage.setItem(this.tokenKey, data.token);
				return { success: true };
			}

			return {
				success: false,
				message: data.message || "Login failed",
			};
		} catch (error) {
			return {
				success: false,
				message: "An error occurred during login",
			};
		}
	}

	// Logout
	logout(): void {
		localStorage.removeItem(this.tokenKey);
	}

	// Get the auth token
	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}
}

export const authService = new AuthService();
