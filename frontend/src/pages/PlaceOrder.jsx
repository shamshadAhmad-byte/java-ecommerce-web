import React, { useContext, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const { getAmount, navigate, url, token, cartItems, setCartItems, currency } =
    useContext(ShopContext);

  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const onChangeHandle = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandle = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please sign in before placing an order.");
      navigate("/login");
      return;
    }

    const orderItemDtos = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          orderItemDtos.push({
            productId: Number(items),
            quantity: Number(cartItems[items][item]),
            size: item,
          });
        }
      }
    }

    if (orderItemDtos.length === 0) {
      toast.error("Your shopping cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;
      const orderReqDto = {
        orderItemDtos: orderItemDtos,
        totalAmount: Number(getAmount() + 50),
        paymentMethod: method === "COD" ? "COD" : "stripe",
        successUrl: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/cart`,
        shippingAddress: {
          firstName: address.firstname.trim(),
          lastName: address.lastname.trim(),
          email: address.email.trim(),
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zipCode: address.zipcode.trim(),
          country: address.country.trim(),
          phone: address.phone.trim(),
        },
      };

      const response = await axios.post(`${url}/api/orders`, orderReqDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200 || response.data?.success || response.data?.id) {
        setCartItems({});
        try {
          localStorage.removeItem("cartItems");
        } catch {}

        if (method === "stripe" && (response.data?.sessionUrl || response.data?.checkoutUrl)) {
          toast.info("Redirecting to Stripe payment checkout...");
          window.location.replace(response.data.sessionUrl || response.data.checkoutUrl);
        } else {
          toast.success("Order placed successfully!");
          navigate("/order");
        }
      } else {
        toast.error(response.data?.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to place order. Please check inputs and try again.";
      toast.error(typeof errMsg === "string" ? errMsg : "Order error");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getAmount();
  const total = subtotal > 0 ? subtotal + 50 : 0;

  return (
    <form
      onSubmit={onSubmitHandle}
      className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-10"
    >
      {/* Left Column: Delivery Address */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Delivery Information
          </h2>
          <div className="h-0.5 w-12 bg-black"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.firstname}
            placeholder="First Name"
            name="firstname"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.lastname}
            name="lastname"
            placeholder="Last Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <input
            type="email"
            onChange={onChangeHandle}
            value={address.email}
            name="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.street}
            name="street"
            placeholder="Street Address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.city}
            name="city"
            placeholder="City"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.state}
            name="state"
            placeholder="State"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.zipcode}
            name="zipcode"
            placeholder="Zip Code"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.country}
            name="country"
            placeholder="Country"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <input
            type="text"
            onChange={onChangeHandle}
            value={address.phone}
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </div>

      {/* Right Column: Order Summary & Payment */}
      <div className="w-full md:w-96 space-y-6">
        {/* Cart Totals */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-bold text-gray-900">Cart Totals</h3>
            <div className="h-0.5 w-8 bg-black"></div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                {currency}
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span>{currency}50</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>
                {currency}
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-gray-900">
              Payment Method
            </h3>
            <div className="h-0.5 w-8 bg-black"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod("COD")}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                method === "COD"
                  ? "bg-black text-white border-black shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>Cash on Delivery</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("stripe")}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                method === "stripe"
                  ? "bg-black text-white border-black shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>Stripe Card</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading || subtotal === 0}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                <span>Processing Order...</span>
              </>
            ) : (
              "PLACE ORDER"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
