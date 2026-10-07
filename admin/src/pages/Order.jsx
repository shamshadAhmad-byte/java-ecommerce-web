import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets, url, url1 } from "../admin_assets/assets";

const STATUS_OPTIONS = [
  { value: "order placed", label: "Order Placed" },
  { value: "packing", label: "Packing" },
  { value: "shipped", label: "Shipped" },
  { value: "out for delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

function Order({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const authToken = token || localStorage.getItem("token");

    try {
      let response;
      try {
        response = await axios.get(`${url}/api/orders/admin`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch (err) {
        console.warn("Falling back to /api/orders/listorders:", err);
        response = await axios.get(`${url}/api/orders/listorders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (response.data) {
        const orderList = Array.isArray(response.data)
          ? response.data
          : response.data.orders || [];
        setOrders(orderList);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const authToken = token || localStorage.getItem("token");
    setUpdatingId(orderId);

    try {
      const response = await axios.post(
        `${url}/api/orders/updatestatus`,
        {
          orderId: Number(orderId),
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data?.success || response.status === 200) {
        toast.success(`Order #${orderId} updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((ord) =>
            (ord.id || ord._id) === orderId ? { ...ord, status: newStatus } : ord
          )
        );
      } else {
        toast.error(response.data?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getItemImage = (item) => {
    if (Array.isArray(item.image) && item.image.length > 0) {
      const first = item.image[0];
      if (typeof first === "string" && first.startsWith("http")) return first;
      return `${url1}/images/${first}`;
    }
    if (typeof item.image === "string") {
      if (item.image.startsWith("http")) return item.image;
      return `${url1}/images/${item.image}`;
    }
    return assets.parcel_icon;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Total orders received: {orders.length}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 flex flex-col items-center justify-center text-gray-500">
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
          <span className="text-sm">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-500">
          <img
            src={assets.order_icon}
            alt=""
            className="w-12 h-12 mx-auto mb-3 opacity-40"
          />
          <p className="text-base font-medium">No orders found</p>
          <p className="text-xs text-gray-400 mt-1">
            New customer orders will appear here once placed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order.id || order._id;
            const address = order.shippingAddress || order.address || {};
            const items = order.items || [];
            const isPaid =
              order.paymentStatus === "COMPLETED" ||
              order.paymentStatus === "PAID" ||
              order.payment === true;

            return (
              <div
                key={orderId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition hover:shadow-md"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-base">
                      Order #{orderId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700 uppercase">
                      {order.paymentMethod || "COD"}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Main details grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
                  {/* Items list */}
                  <div className="lg:col-span-5 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ordered Items ({items.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                        >
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="w-12 h-14 object-cover rounded bg-white border border-gray-200 shrink-0"
                            onError={(e) => {
                              e.target.src = assets.parcel_icon;
                            }}
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-semibold text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-gray-500 mt-0.5">
                              Size: <span className="font-medium text-gray-700">{item.size || "—"}</span> × {item.quantity}
                            </p>
                            <p className="font-semibold text-gray-900 mt-0.5">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Shipping info */}
                  <div className="lg:col-span-4 text-xs space-y-1.5 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                    <h4 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Customer & Delivery Address
                    </h4>
                    <p className="font-bold text-gray-900 text-sm">
                      {address.firstName || address.firstname}{" "}
                      {address.lastName || address.lastname || order.customerName}
                    </p>
                    <p className="text-gray-600">
                      {order.customerEmail || address.email}
                    </p>
                    <p className="text-gray-600">
                      {[
                        address.street,
                        address.city,
                        address.state,
                        address.zipCode || address.zipcode,
                        address.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No address provided"}
                    </p>
                    <p className="text-gray-600 font-medium">
                      Phone: {address.phone || order.customerPhone || "—"}
                    </p>
                  </div>

                  {/* Pricing & Status Control */}
                  <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0 space-y-4">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-gray-500">Total Amount</span>
                      <p className="text-xl font-extrabold text-gray-900">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div className="w-full">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 text-left lg:text-right">
                        Order Status
                      </label>
                      <select
                        value={(order.status || "order placed").toLowerCase()}
                        disabled={updatingId === orderId}
                        onChange={(e) => updateStatus(orderId, e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-black focus:border-black outline-none cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order;
