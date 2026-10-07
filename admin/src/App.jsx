import React, { useEffect, useState } from "react";
import { assets } from "./admin_assets/assets";
import { Route, Routes, NavLink, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import Login from "./components/Login";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || "");
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Forward accidental payment returns landing on Admin port (5173) to Frontend (5174)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/order-success" || path === "/verify") {
      const search = window.location.search;
      window.location.replace(`http://localhost:5174/verify${search}`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition border ${
      isActive
        ? "bg-black text-white border-black shadow-sm"
        : "text-gray-700 bg-white hover:bg-gray-100 border-gray-200"
    }`;

  if (!token) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login setToken={setToken} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-10 object-contain cursor-pointer"
            onClick={() => navigate("/list")}
          />
          <span className="text-xs uppercase tracking-wider font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition"
              title="View Admin Profile"
            >
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {user.name || "Admin"}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {user.role || "ADMIN"}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 space-y-2 shrink-0">
          <NavLink to="/add" className={navLinkClass}>
            <img src={assets.add_icon} alt="" className="w-5 h-5 object-contain" />
            <span>Add Products</span>
          </NavLink>
          <NavLink to="/list" className={navLinkClass}>
            <img src={assets.parcel_icon} alt="" className="w-5 h-5 object-contain" />
            <span>Product List</span>
          </NavLink>
          <NavLink to="/order" className={navLinkClass}>
            <img src={assets.order_icon} alt="" className="w-5 h-5 object-contain" />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Admin Profile</span>
          </NavLink>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/order" element={<Order token={token} />} />
            <Route path="/profile" element={<Profile token={token} setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
