import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets, url, url1 } from "../admin_assets/assets";

function List({ token }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    const authToken = token || localStorage.getItem("token");

    try {
      let response;
      try {
        response = await axios.get(`${url}/api/products/admin`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch (adminErr) {
        // Fallback to public endpoint if admin endpoint returns 403/404
        console.warn("Falling back to public /api/products:", adminErr);
        response = await axios.get(`${url}/api/products`);
      }

      if (response.data) {
        const products = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        setList(products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error.response?.data?.message || "Failed to load product list."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const authToken = token || localStorage.getItem("token");
    try {
      const response = await axios.delete(`${url}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 || response.data?.success) {
        toast.success(response.data?.message || "Product deleted successfully");
        setList((prev) => prev.filter((item) => (item.id || item._id) !== id));
      } else {
        toast.error(response.data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove the product."
      );
    }
  };

  const getProductImage = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const first = item.images[0];
      return typeof first === "object" ? first.imageUrl : first;
    }
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

  const getSizesText = (item) => {
    if (Array.isArray(item.sizes) && item.sizes.length > 0) {
      return item.sizes
        .map((s) => (typeof s === "object" ? s.size : s))
        .join(", ");
    }
    if (Array.isArray(item.size) && item.size.length > 0) {
      return item.size.join(", ");
    }
    return "—";
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
    fetchList();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Products</h2>
          <p className="text-xs text-gray-500 mt-1">
            Total items listed: {list.length}
          </p>
        </div>
        <button
          onClick={fetchList}
          className="self-start sm:self-auto px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Refresh List
        </button>
      </div>

      {loading ? (
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
          <span className="text-sm">Loading products...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <img
            src={assets.parcel_icon}
            alt=""
            className="w-12 h-12 mx-auto mb-3 opacity-40"
          />
          <p className="text-base font-medium">No products found</p>
          <p className="text-xs text-gray-400 mt-1">
            Use the "Add Products" tab to add inventory to your catalog.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Sizes</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Bestseller</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((item) => {
                const itemId = item.id || item._id;
                const imgSrc = getProductImage(item);

                return (
                  <tr key={itemId} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-md border border-gray-200 bg-gray-50"
                        onError={(e) => {
                          e.target.src = assets.parcel_icon;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs">
                      <div className="line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{item.category}</div>
                      <div className="text-xs text-gray-400">
                        {item.subCategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {getSizesText(item)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.bestSeller ? (
                        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => removeProduct(itemId)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default List;
