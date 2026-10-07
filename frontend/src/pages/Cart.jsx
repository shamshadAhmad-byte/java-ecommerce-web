import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { ShopContext } from "../contextStore/ShopContext";

function Cart() {
  const {
    products,
    cartItems,
    updateQuantity,
    getAmount,
    currency,
    navigate,
    getImageUrl,
  } = useContext(ShopContext);
  const [cartData, setCartCData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempCopy = [];
      for (const itemId in cartItems) {
        for (const item in cartItems[itemId]) {
          if (cartItems[itemId][item] > 0) {
            tempCopy.push({
              _id: itemId,
              size: item,
              quantity: cartItems[itemId][item],
            });
          }
        }
      }
      setCartCData(tempCopy);
    }
  }, [cartItems, products]);
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Product</th>
                    <th className="text-left font-semibold">Price</th>
                    <th className="text-left font-semibold">Quantity</th>
                    <th className="text-left font-semibold">Delete</th>
                  </tr>
                </thead>
                {cartData.map((item, index) => {
                  const productData = products.find(
                    (product) => String(product._id ?? product.id) === String(item._id)
                  );
                  if (!productData) return null;
                  return (
                    <tbody key={index}>
                      <tr>
                        <td className="py-4">
                          <div className="flex items-center">
                            <img
                              className="h-16 w-16 mr-4 object-cover rounded"
                              src={getImageUrl(productData.image)}
                              alt={productData.name || "Product image"}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/100x100?text=Product";
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold mb-[10px]">
                                {productData.name}
                              </span>
                              <span className="size-6 bg-slate-300 self-center text-center">
                                {item.size}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          {currency}
                          {productData.price}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <input
                              className="border rounded-m px-2 mr-2"
                              type="number"
                              defaultValue={item.quantity}
                              min={1}
                              onChange={(e) =>
                                e.target.value === "" || e.target.value === "0"
                                  ? null
                                  : updateQuantity(
                                      item._id,
                                      item.size,
                                      Number(e.target.value)
                                    )
                              }
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <img
                            onClick={() =>
                              updateQuantity(item._id, item.size, 0)
                            }
                            src={assets.bin_icon}
                            className="size-6 object-cover"
                          />
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>
                  {currency}
                  {getAmount()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>{currency}50</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {currency}
                  {getAmount() + 50}
                </span>
              </div>

              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                onClick={() => navigate("/placeorder")}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
