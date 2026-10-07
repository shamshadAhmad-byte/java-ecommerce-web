import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShopContext } from "../contextStore/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

function Verify() {
  const { url, token, setCartItems, navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const [verifying, setVerifying] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const sessionId =
    searchParams.get("session_id") ||
    searchParams.get("sessionId") ||
    searchParams.get("id");
  const successParam = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      setErrorStatus(null);

      // If user was redirected with success=false or cancelled
      if (successParam === "false") {
        setErrorStatus("Payment was cancelled or could not be completed.");
        toast.warn("Payment was cancelled.");
        setTimeout(() => navigate("/cart"), 2500);
        return;
      }

      // Check if we have a Stripe session ID
      if (sessionId) {
        const activeToken = token || localStorage.getItem("token") || "";
        const response = await axios.post(
          `${url}/api/orders/verify-stripe?sessionId=${encodeURIComponent(sessionId)}`,
          {},
          activeToken
            ? {
                headers: {
                  Authorization: `Bearer ${activeToken}`,
                  token: activeToken,
                },
              }
            : {}
        );

        if (response.data && (response.data.success || response.data.id || response.status === 200)) {
          setCartItems({});
          try {
            localStorage.removeItem("cartItems");
          } catch {}
          toast.success("Payment verified! Your order has been placed.");
          setTimeout(() => navigate("/order"), 1500);
          return;
        }
      } else if (orderId) {
        // Fallback for legacy orderId verification
        const response = await axios.post(
          `${url}/api/orders/verifyorder`,
          { success: successParam !== "false", orderId },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                  token: token,
                },
              }
            : {}
        );
        if (response.data?.success || response.data?.sucess) {
          setCartItems({});
          try {
            localStorage.removeItem("cartItems");
          } catch {}
          toast.success("Order confirmed successfully!");
          setTimeout(() => navigate("/order"), 1500);
          return;
        }
      } else {
        // No session ID found
        setErrorStatus("No payment session reference found in the URL.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Payment verification failed. Please check your order history or contact support.";
      setErrorStatus(errMsg);
      toast.error(errMsg);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [sessionId, orderId, successParam]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        {verifying ? (
          <div>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verifying Payment...
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Please wait while we confirm your transaction with Stripe. Do not close or refresh this page.
            </p>
          </div>
        ) : errorStatus ? (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verification Notice
            </h3>
            <p className="text-sm text-gray-600 mb-6">{errorStatus}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/order"
                className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                Check My Orders
              </Link>
              <Link
                to="/cart"
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your order has been placed and confirmed. Redirecting to your orders list...
            </p>
            <Link
              to="/order"
              className="inline-block px-6 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              View Orders Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;
