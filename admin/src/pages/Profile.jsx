import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../admin_assets/assets";

function Profile({ token, setToken }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetchProfileAndStats = async () => {
    setLoading(true);
    const authToken = token || localStorage.getItem("token");

    try {
      // 1. Fetch authenticated user profile
      const userRes = await axios.get(`${url}/api/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (userRes.data) {
        setUserData(userRes.data);
        setEditForm({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
        });
        localStorage.setItem("user", JSON.stringify(userRes.data));
      }

      // 2. Fetch stats (products & orders) in parallel
      try {
        const [prodRes, orderRes] = await Promise.allSettled([
          axios.get(`${url}/api/products/admin`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${url}/api/orders/admin`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        let pCount = 0;
        if (prodRes.status === "fulfilled" && prodRes.value.data) {
          const prods = Array.isArray(prodRes.value.data)
            ? prodRes.value.data
            : prodRes.value.data.products || [];
          pCount = prods.length;
        }

        let oCount = 0;
        if (orderRes.status === "fulfilled" && orderRes.value.data) {
          const ords = Array.isArray(orderRes.value.data)
            ? orderRes.value.data
            : orderRes.value.data.orders || [];
          oCount = ords.length;
        }

        setStats({ productCount: pCount, orderCount: oCount });
      } catch (statsErr) {
        console.warn("Could not fetch metrics:", statsErr);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to local storage if network or token error
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
          setUserData(storedUser);
          setEditForm({
            name: storedUser.name || "",
            email: storedUser.email || "",
          });
        }
      } catch {}
      toast.error(
        error.response?.data?.message || "Failed to load latest profile info."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!editForm.email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    setSavingProfile(true);
    const authToken = token || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${url}/api/users`,
        {
          name: editForm.name.trim(),
          email: editForm.email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        setUserData(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          if (setToken) setToken(response.data.token);
        }

        toast.success("Profile details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwordForm;

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    const authToken = token || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${url}/api/users`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        toast.success("Password changed successfully!");
        setPasswordForm({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <svg
          className="animate-spin h-8 w-8 text-black mb-3"
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
        <span className="text-sm">Loading admin profile...</span>
      </div>
    );
  }

  const userInitial = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Admin Profile</h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your account credentials, security, and administrative settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {userData?.name || "Administrator"}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black text-white uppercase tracking-wider">
                  {userData?.role || "ADMIN"}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {userData?.email || "No email provided"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Account created: {formatDate(userData?.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={fetchProfileAndStats}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Refresh Profile
          </button>
        </div>
      </div>

      {/* Activity Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Products Managed
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.productCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.orderCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              API Server
            </span>
            <p className="text-sm font-bold text-green-700 mt-1">
              Connected (8080)
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">
              Personal Information
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your display name and email address.
            </p>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
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
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">
              Security & Password
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Change your admin account password (minimum 8 characters).
            </p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {savingPassword ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
