import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Order() {
  const { url, token, getImageUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      let orderList = [];
      if (Array.isArray(response.data)) {
        orderList = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        orderList = response.data.data;
      } else if (response.data && Array.isArray(response.data.orders)) {
        orderList = response.data.orders;
      }

      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message || "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Sign In to View Orders
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Please sign in to your account to review your past orders, delivery tracking, and purchase history.
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <div className="w-10 h-0.5 bg-black"></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your recent purchases
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 text-sm border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Orders Placed Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Looks like you haven't placed any orders yet. Discover our latest collections and start shopping!
          </p>
          <Link
            to="/collection"
            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, orderIdx) => {
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent";

            const isOrderPaid =
              order.paymentStatus === "COMPLETED" ||
              order.paymentStatus === "PAID" ||
              order.payment === true;

            const orderStatus = order.status || "Order Placed";

            return (
              <div
                key={order.id || order._id || orderIdx}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Order Summary Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-gray-500 block text-xs">
                        ORDER PLACED
                      </span>
                      <span className="font-medium text-gray-900">
                        {orderDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">TOTAL</span>
                      <span className="font-semibold text-gray-900">
                        {currency}
                        {order.totalAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">
                        PAYMENT
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium uppercase text-xs text-gray-800">
                          {order.paymentMethod || "COD"}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isOrderPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isOrderPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      ORDER # {order.id || order._id}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      {orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="divide-y divide-gray-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIdx) => {
                      const itemImg = getImageUrl(item.image);
                      return (
                        <div
                          key={item.id || itemIdx}
                          className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={itemImg}
                              alt={item.name}
                              className="w-20 h-24 object-cover rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/100x120?text=Item";
                              }}
                            />
                            <div className="space-y-1">
                              <h4 className="font-semibold text-gray-900 text-base">
                                {item.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span>
                                  Price: {currency}
                                  {item.price}
                                </span>
                                <span>•</span>
                                <span>Qty: {item.quantity}</span>
                                {item.size && (
                                  <>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                      Size: {item.size}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <span className="font-medium">
                                {item.status || orderStatus}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                toast.info(
                                  `Order #${order.id || order._id} is currently ${
                                    item.status || orderStatus
                                  }`
                                )
                              }
                              className="text-xs px-3 py-1.5 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition"
                            >
                              Track Item
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-sm text-gray-500">
                      No item details available for this order.
                    </div>
                  )}
                </div>

                {/* Shipping Address Footer (if available) */}
                {order.shippingAddress && (
                  <div className="bg-gray-50/70 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-2">
                    <span className="font-medium text-gray-700">
                      Shipping to:
                    </span>
                    <span>
                      {[
                        order.shippingAddress.firstName,
                        order.shippingAddress.lastName,
                        order.shippingAddress.street,
                        order.shippingAddress.city,
                        order.shippingAddress.state,
                        order.shippingAddress.zipCode,
                        order.shippingAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order;
