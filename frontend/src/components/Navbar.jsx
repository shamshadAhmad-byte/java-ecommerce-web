import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { ShopContext } from "../contextStore/ShopContext";

function Navbar() {
  const { setShowSearch, getCart, navigate, token, logout } =
    useContext(ShopContext);
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CloTheOnL
          </span>
        </NavLink>
        <div
          className="hidden w-full md:block md:w-auto item-center"
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                className="block py-2 px-3 text-black bg-blue-700 rounded md:bg-transparent md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collection"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0   dark:hover:bg-gray-700  md:dark:hover:bg-transparent"
              >
                Collection
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Contact
              </NavLink>
            </li>
             <li>
              <NavLink
                to="/chat-with-ai"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Chat with AI
              </NavLink>
            </li>
          </ul>
        </div>
        <div onClick={() => setShowSearch(true)}>
          <img src={assets.search_icon} className="h-6 w-6 object-cover" />
        </div>
        <div className="flex flex-row item-center h-10 w-35 justify-around gap-4">
          <div className="w-[20px] h-[20px] self-center bg-white mx-[15px] relative group cursor-pointer">
            <img
              src={assets.profile_icon}
              onClick={() => (token ? null : navigate("/login"))}
            />
            {token && (
              <ul className="absolute left-0 hidden group-hover:block bg-black shadow-lg text-white pr-5">
                <li className="p-2">
                  <Link to="/myprofile">My Profile</Link>
                </li>
                <li className="p-2">
                  <Link to="/order">Order</Link>
                </li>
                <li className="p-2 cursor-pointer" onClick={logout}>
                  Logout
                </li>
              </ul>
            )}
          </div>
          <div className="h-[25px] w-[25px] self-center relative">
            <Link to="/cart">
              <img
                src={assets.cart_icon}
                className="h-[25px] w-[25px] object-cover"
              />
              <p className="absolute -right-1 -bottom-2 text-xs text-red-900">
                {getCart()}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
