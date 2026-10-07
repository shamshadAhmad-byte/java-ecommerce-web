import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../contextStore/ShopContext";

export default function ProductsItem({ id, price, name, image }) {
  const { currency, getImageUrl } = useContext(ShopContext);
  const productId = id !== undefined && id !== null && id !== "undefined" ? id : "";
  return (
    <Link to={productId ? `/product/${productId}` : "/collection"}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300">
        <img
          className="w-full h-64 object-cover"
          src={getImageUrl(image)}
          alt={name || "Product Image"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x500?text=Product+Image";
          }}
        />

        <div className="px-6 py-1">
          <div className="font-bold text-xl mb-1">{name}</div>
        </div>
        <div className="px-6 pt-1 pb-1">
          <span className="text-gray-900 font-bold text-xl">
            {currency}
            {price}
          </span>
        </div>
      </div>
    </Link>
  );
}
