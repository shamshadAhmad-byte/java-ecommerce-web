import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../contextStore/ShopContext";
import RealtedProduct from "../components/RealtedProduct";
import axios from "axios";

function Product() {
  const { productId } = useParams();
  const { products, addCartData, currency, getImageUrl, setSelectClothe, url } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [changeImage, setChangeImage] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    const targetId = String(productId || "").trim();

    if (!targetId || targetId === "undefined" || targetId === "null") {
      setProductData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Try finding in context products array
    if (products && products.length > 0) {
      const found = products.find(
        (item) => String(item._id ?? item.id) === targetId
      );
      if (found) {
        setProductData(found);
        const firstImg =
          Array.isArray(found.image) && found.image.length > 0
            ? found.image[0]
            : "";
        setChangeImage(firstImg);
        setLoading(false);
        return;
      }
    }

    // 2. Fetch directly from backend API
    try {
      const response = await axios.get(`${url}/api/products/${targetId}`);
      if (response.data) {
        const item = response.data;
        const resolvedId = item._id || item.id;
        const images =
          Array.isArray(item.image) && item.image.length > 0
            ? item.image
            : Array.isArray(item.images) && item.images.length > 0
            ? item.images
                .map((img) => (typeof img === "string" ? img : img.imageUrl))
                .filter(Boolean)
            : [];

        const sizes =
          Array.isArray(item.size) && item.size.length > 0
            ? item.size
            : Array.isArray(item.sizes) && item.sizes.length > 0
            ? item.sizes
                .map((s) => (typeof s === "string" ? s : s.size))
                .filter(Boolean)
            : [];

        const normalized = {
          ...item,
          _id: String(resolvedId),
          id: resolvedId,
          image: images,
          size: sizes,
        };

        setProductData(normalized);
        setChangeImage(images.length > 0 ? images[0] : "");
      } else {
        setProductData(null);
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    setSize("");
  }, [productId, products]);

  // Loading state
  if (loading && !productData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  // Not found state
  if (!productData) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6 max-w-md text-sm">
          The product you are looking for does not exist or may have been removed from our catalog.
        </p>
        <div className="flex gap-4">
          <Link
            to="/collection"
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Explore Collections
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const imagesList =
    Array.isArray(productData.image) && productData.image.length > 0
      ? productData.image
      : [""];

  return (
    <>
      <div className="bg-gray-50/50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-black">
              Collection
            </Link>
            <span>/</span>
            {productData.category && (
              <>
                <span>{productData.category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {productData.name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            {/* Left: Product Images */}
            <div className="w-full md:w-1/2 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[460px] pb-2 sm:pb-0 shrink-0">
                {imagesList.map((item, index) => {
                  const isSelected = item === changeImage;
                  return (
                    <img
                      key={index}
                      src={getImageUrl(item)}
                      onClick={() => setChangeImage(item)}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg cursor-pointer transition border-2 ${
                        isSelected
                          ? "border-black shadow-sm"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x120?text=Thumb";
                      }}
                    />
                  );
                })}
              </div>

              {/* Main Image */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden min-h-[380px] max-h-[500px]">
                <img
                  src={getImageUrl(changeImage || imagesList[0])}
                  alt={productData.name}
                  className="w-full h-full max-h-[500px] object-contain rounded-xl cursor-pointer hover:scale-105 transition duration-300"
                  onClick={() =>
                    setSelectClothe(
                      getImageUrl(changeImage || imagesList[0])
                    )
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/500x600?text=Product+Image";
                  }}
                />
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {productData.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    (122 customer reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {currency}
                  {productData.price}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {productData.description ||
                    "Premium quality fabric crafted for comfort and modern style. Designed to offer effortless elegance for any occasion."}
                </p>

                {/* Sizes Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Select Size
                    </span>
                    {size && (
                      <span className="text-xs text-green-700 font-medium">
                        Selected: {size}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {productData.size && productData.size.length > 0 ? (
                      productData.size.map((item, index) => {
                        const isSelected = item === size;
                        return (
                          <button
                            type="button"
                            key={index}
                            onClick={() => setSize(item)}
                            className={`min-w-[42px] h-10 px-3 rounded-lg text-sm font-semibold transition border ${
                              isSelected
                                ? "bg-black text-white border-black shadow"
                                : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400">
                        Free Size / One Size Fits All
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() =>
                    addCartData(
                      productData._id || productData.id,
                      size || (productData.size?.[0] || "M")
                    )
                  }
                  className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>

              {/* Assurances */}
              <div className="border-t border-gray-100 pt-5 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-600"
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
                  <span>100% Original and authentic product.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-600"
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
                  <span>Cash on delivery is available for this item.</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-600"
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
                  <span>Hassle-free returns and exchanges within 7 days.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RealtedProduct
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id || productData.id}
      />
    </>
  );
}

export default Product;
