import { useState } from "react";
import { useNavigate } from "react-router-dom";
import viteLogo from "../assets/nodeMart.svg";
import { useAuth } from "../context/AuthContext";
import { showError, showPromise } from "../services/toast";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSubmit = (e) => {
  e.preventDefault();

  const loginPromise = login(email, password);

  showPromise(loginPromise, {
    loading: "Logging In user...",
    success: "Logged in successfully!",
    error: (err) =>
      err.response?.data?.message || "Invalid Credentials",
  }).then(() => {
    navigate("/dashboard");
  });
};

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setMessage("Password reset link sent to your email.");
      setForgotEmail("");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-5">
            <div className="flex items-center gap-1 mb-1">
                <img src={viteLogo} alt="NodeMart Logo" className="w-11 h-11 pt-1" />
                <h1 className="text-[32px] font-semibold tracking-tight">
                    <span style={{ color: "#49AD5E" }}>Node</span>
                    <span style={{ color: "#2B9CCF" }}>Mart</span>
                </h1>
            </div>
            <div className="text-center mb-3">
            <p className="text-sm text-gray-500 mt-1">Login to your account</p>
            </div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#2B9CCF" }}
            className="w-full h-10 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <span
            className="cursor-pointer underline"
            onClick={() => setShowForgot(!showForgot)}
          >
            Forgot Password?
          </span>
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#2B9CCF" }} className="underline">
            Register here
          </a>
        </div>

        {/* ================= FORGOT PASSWORD ================= */}
        {showForgot && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Reset Password
            </h3>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              {/* <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full h-10 bg-green-600 text-white font-medium rounded hover:bg-green-700"
              >
                Send Reset Link
              </button> */}
              <h2>This feature is under development</h2>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
