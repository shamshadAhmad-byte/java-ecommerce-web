import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets, url } from "../admin_assets/assets";

function Login({ setToken }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
    });
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const emailTrimmed = formData.email.trim();

    if (mode === "signup") {
      if (!formData.name.trim()) {
        const msg = "Please enter your full name.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (formData.password.length < 8) {
        const msg = "Password must be at least 8 characters long.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        const msg = "Passwords do not match.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const response = await axios.post(`${url}/api/users/signin`, {
          email: emailTrimmed,
          password: formData.password,
          role: "ADMIN",
        });

        if (response.data && response.data.token) {
          const userRole = (response.data.role || "").toUpperCase();
          if (userRole !== "ADMIN" && userRole !== "SELLER") {
            const msg = "Access Denied: Only Admin or Seller accounts are authorized.";
            setErrorMessage(msg);
            toast.error(msg);
            setLoading(false);
            return;
          }

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data));
          setToken(response.data.token);
          toast.success(`Welcome back, ${response.data.name || "Admin"}!`);
        } else {
          const msg = response.data?.message || "Sign in failed. Check credentials.";
          setErrorMessage(msg);
          toast.error(msg);
        }
      } else {
        // Sign Up
        const response = await axios.post(`${url}/api/users/signup`, {
          name: formData.name.trim(),
          email: emailTrimmed,
          password: formData.password,
          role: formData.role || "ADMIN",
        });

        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data));
          setToken(response.data.token);
          toast.success(
            `Admin account created successfully! Welcome, ${response.data.name || "Admin"}!`
          );
        } else {
          const msg = response.data?.message || "Sign up failed. Please try again.";
          setErrorMessage(msg);
          toast.error(msg);
        }
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Could not connect to the backend server. Please verify the server is running on port 8080.";
      const displayMsg = typeof msg === "string" ? msg : JSON.stringify(msg);
      setErrorMessage(displayMsg);
      toast.error(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-32 object-contain mb-2"
          />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {mode === "signin"
              ? "Sign in to manage catalog, orders, and store settings"
              : "Register a new Administrator or Seller account"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === "signin"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === "signup"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
            <svg
              className="w-4 h-4 shrink-0 mt-0.5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmitHandle}>
          {mode === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={onChangeHandle}
                required
                placeholder="John Doe"
                disabled={loading}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition disabled:bg-gray-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={onChangeHandle}
              required
              placeholder="admin@example.com"
              disabled={loading}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={onChangeHandle}
              required
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              disabled={loading}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition disabled:bg-gray-100"
            />
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChangeHandle}
                  required
                  placeholder="Re-enter your password"
                  disabled={loading}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: "ADMIN" }))
                    }
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      formData.role === "ADMIN"
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: "SELLER" }))
                    }
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      formData.role === "SELLER"
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Seller / Vendor
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>
                  {mode === "signin"
                    ? "Signing in..."
                    : "Creating Account..."}
                </span>
              </>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center pt-2 border-t border-gray-100">
          {mode === "signin" ? (
            <p className="text-xs text-gray-600">
              Don't have an admin account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="text-black font-semibold hover:underline"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="text-black font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;
