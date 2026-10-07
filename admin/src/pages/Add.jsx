import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets, url } from "../admin_assets/assets";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

function Add({ token }) {
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    subCategory: "Topwear",
    bestSeller: false,
  });

  const [selectedSizes, setSelectedSizes] = useState([]);

  const handleImageChange = (index, file) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const onChangeHandle = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const activeFiles = imageFiles.filter(Boolean);
    if (activeFiles.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    if (selectedSizes.length === 0) {
      toast.error("Please select at least one product size.");
      return;
    }

    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      toast.error("Authentication expired. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const productPayload = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category,
        subCategory: data.subCategory,
        bestSeller: Boolean(data.bestSeller),
        sizes: selectedSizes.map((s) => ({ size: s })),
      };

      formData.append("product", JSON.stringify(productPayload));

      activeFiles.forEach((file) => {
        formData.append("files", file);
        formData.append("image", file);
      });

      const response = await axios.post(`${url}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 201 || response.status === 200 || response.data?.success || response.data?.id) {
        toast.success("Product added successfully!");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Men",
          subCategory: "Topwear",
          bestSeller: false,
        });
        setImageFiles([null, null, null, null]);
        setSelectedSizes([]);
      } else {
        toast.error(response.data?.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to upload product. Check backend connection.";
      toast.error(typeof errMsg === "string" ? errMsg : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h2>

      <form onSubmit={onSubmitHandle} className="space-y-6">
        {/* Images Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images <span className="text-xs text-gray-500 font-normal">(Upload up to 4 images, at least 1 required)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {imageFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <input
                  type="file"
                  id={`image-${idx}`}
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageChange(idx, e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor={`image-${idx}`}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black transition overflow-hidden bg-gray-50"
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center p-2 text-center">
                      <img
                        src={assets.upload_area}
                        alt="Upload"
                        className="w-8 h-8 object-contain mb-1 opacity-60"
                      />
                      <span className="text-[10px] text-gray-500">Slot {idx + 1}</span>
                    </div>
                  )}
                </label>

                {file && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                    title="Remove Image"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandle}
            placeholder="e.g. Classic Cotton Crewneck T-Shirt"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={onChangeHandle}
            rows={4}
            placeholder="Detailed description of material, fit, and styling..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>

        {/* Categories & Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black focus:border-black outline-none cursor-pointer"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Category
            </label>
            <select
              name="subCategory"
              value={data.subCategory}
              onChange={onChangeHandle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black focus:border-black outline-none cursor-pointer"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandle}
              min="0"
              placeholder="e.g. 499"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
            />
          </div>
        </div>

        {/* Sizes Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Sizes <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-11 h-10 rounded-lg border text-sm font-semibold transition ${
                    isSelected
                      ? "bg-black text-white border-black shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Seller Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bestSeller"
            name="bestSeller"
            checked={data.bestSeller}
            onChange={onChangeHandle}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
          />
          <label
            htmlFor="bestSeller"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Mark as Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                <span>Uploading & Adding Product...</span>
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add;
