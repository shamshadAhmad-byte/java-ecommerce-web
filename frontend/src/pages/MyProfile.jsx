import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function MyProfile() {
  const { url, token, setToken, logout, navigate } = useContext(ShopContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      if (response.data) {
        setUserData(response.data);
        setName(response.data.name || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load user profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (password && password.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
      };
      if (password) {
        payload.password = password;
      }

      const response = await axios.put(`${url}/api/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      if (response.data) {
        setUserData(response.data);
        setName(response.data.name || "");
        setPassword("");

        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        }

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Sign In to View Profile
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Please sign in to access and manage your profile details, shipping preferences, and security settings.
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Member";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <div className="w-10 h-0.5 bg-black"></div>
      </div>

      {loading && !userData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading your profile information...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 text-white text-3xl font-bold flex items-center justify-center mb-4 shadow-md">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {userData?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{userData?.email}</p>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              {userData?.role || "CUSTOMER"}
            </span>

            <div className="w-full border-t border-gray-100 pt-4 space-y-3 text-left">
              <div className="text-xs text-gray-500">
                <span className="block font-medium text-gray-700">Joined On</span>
                <span>{memberSince}</span>
              </div>
            </div>

            <div className="w-full border-t border-gray-100 pt-6 mt-6 space-y-2">
              <Link
                to="/order"
                className="w-full block py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 text-center transition"
              >
                View My Orders
              </Link>
              <Link
                to="/cart"
                className="w-full block py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 text-center transition"
              >
                View Shopping Cart
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium text-center transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Right Column: Edit Profile & Password Form */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Account Information
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Update your account display name or change your account password
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Email address cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-black outline-none transition"
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  New Password (optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    minLength={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-black outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Must be at least 8 characters long if updating.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition shadow flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
