import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import loginDesign from "./styles";
import { loginUser } from "../../backend/controller/authContoller";
import { getUserById } from "../../backend/controller/userController";
import { getCustomerInfo } from "../../backend/controller/customerController";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slices/userSlice";
import { setCustomer } from "../../redux/slices/customerSlice";

const API_URL = import.meta.env.VITE_API_URL || "";

function Login() {
	const styles = loginDesign;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	// Separate loading state for Google
	const [googleLoading, setGoogleLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await loginUser({ identifier, password });

			if (!response.success) {
				setError(response.message || "Login failed");
				return;
			}

			localStorage.setItem("token", response.token);
			window.dispatchEvent(new Event("auth-token-updated"));

			const userRes = await getUserById(response.user.user_login_id);
			const u = userRes?.user ?? userRes;

			console.log("userRes--------->", userRes);
			dispatch(
				setUser({
					user_login_id: response.user.user_login_id,
					user_id: u?.user_id || response.user.user_id,
					customer_id: response.user.customer_id,
					name: u
						? `${u.user_first_name || ""} ${u.user_last_name || ""}`.trim()
						: response.user.name,
					firstName: u?.user_first_name || "",
					lastName: u?.user_last_name || "",
					email: u?.user_email_id || "",
					adminFlag: u?.user_admin_flag || "N",
				})
			);

			try {
				const customerResult = await getCustomerInfo(
					response.user.user_login_id
				);
				if (customerResult?.success && customerResult?.customer) {
					const c = customerResult.customer;
					dispatch(
						setCustomer({
							customerId: c.customer_id,
							customerName: c.customer_name || "",
							phoneNumber: c.customer_phone || "",
							customerAddress: c.customer_address || "",
							emailAddress: c.customer_email_id || "",
							additionalNotes:
								c.customers_additional_notes ||
								c.customers_addional_notes ||
								"",
						})
					);
				}
			} catch {
				// silent
			}

			if (u.user_admin_flag === "Y") {
				navigate("/admin", { replace: true });
			} else {
				navigate("/dashboard", { replace: true });
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleRedirect = () => {
		setGoogleLoading(true);
		const returnTo = `${window.location.origin}/login`;
		const url = `${API_URL}/auth/google?returnTo=${encodeURIComponent(
			returnTo
		)}`;
		window.location.assign(url);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.gridContainer}>
				<div className={styles.card}>
					<img
						src="/Arrant.jpeg"
						alt="Arrant Logo"
						className={styles.logoImg}
					/>

					<h2 className={styles.cardTitle}>Welcome back</h2>
					<p className={styles.cardInfo}>
						Sign in to your <strong>STERI Clean Air</strong> account
					</p>

					<hr className={styles.divider} />

					<form onSubmit={handleLogin}>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Email Address or UserID</label>
							<div className={styles.inputWrapper}>
								<FaEnvelope className={styles.mailIcon} />
								<input
									type="text"
									placeholder="Enter your email or UserID"
									className={styles.input}
									value={identifier}
									onChange={(e) => setIdentifier(e.target.value)}
								/>
							</div>

							<label className={styles.label}>Password</label>
							<div className={styles.inputWrapper}>
								<FaLock className={styles.mailIcon} />
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									className={styles.input}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type="button"
									className={styles.eyeBtn}
									onClick={() => setShowPassword((p) => !p)}
								>
									{showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
								</button>
							</div>

							<Link to="/forgot-password" className={styles.resetPwdLink}>
								Forgot Password?
							</Link>

							{error && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl mb-4 text-xs font-semibold">
									{error}
								</div>
							)}

							{/* Sign In — only disabled when Sign In is loading */}
							<button
								type="submit"
								disabled={loading}
								className={`${styles.loginButton} ${
									loading ? "opacity-60 cursor-not-allowed" : ""
								}`}
							>
								{loading ? "Signing In..." : "Sign In"}
							</button>

							<div className="flex items-center gap-3 my-2">
								<div className="flex-1 h-px bg-gray-200" />
								<span className="text-xs text-gray-400 font-semibold">or</span>
								<div className="flex-1 h-px bg-gray-200" />
							</div>

							{/* Google — only disabled when Google is loading */}
							<button
								type="button"
								onClick={handleGoogleRedirect}
								disabled={googleLoading}
								className={`${styles.googleButton} ${
									googleLoading ? "opacity-60 cursor-not-allowed" : ""
								}`}
							>
								<img
									src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
									alt="Google"
									className="w-5 h-5"
								/>
								{googleLoading ? "Redirecting..." : "Continue with Google"}
							</button>
						</div>
					</form>
				</div>

				<p className="text-center text-xs text-[#3d6080] mt-5">
					© 2026 STERI Clean Air — Arrant Dynamics
				</p>
			</div>
		</div>
	);
}

export default Login;
