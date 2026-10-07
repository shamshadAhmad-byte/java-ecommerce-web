import { createContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const currency = "₹";
  const [showPara, setShowPara] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems") || "{}");
    } catch {
      return {};
    }
  });
  const [cartIdMap, setCartIdMap] = useState({}); // maps "productId_size" -> cartId
  const [selectClothe, setSelectClothe] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const url = backendUrl;
  const url1 = backendUrl;

  const navigate = useNavigate();

  // Save cartItems to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addCartData = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size first.");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size] > 0) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success("Item added to cart!");

    if (token) {
      try {
        const response = await axios.post(
          `${url}/api/cart`,
          {
            productId: Number(itemId),
            size: size,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.id) {
          setCartIdMap((prev) => ({
            ...prev,
            [`${itemId}_${size}`]: response.data.id,
          }));
        }
      } catch (error) {
        console.error("Error adding to cart on backend:", error.message);
      }
    }
  };

  const getCart = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const item in cartItems[itemId]) {
        totalCount += cartItems[itemId][item] || 0;
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      const cartKey = `${itemId}_${size}`;
      const cartId = cartIdMap[cartKey];

      try {
        if (quantity <= 0) {
          if (cartId) {
            await axios.delete(`${url}/api/cart/${cartId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCartIdMap((prev) => {
              const updated = { ...prev };
              delete updated[cartKey];
              return updated;
            });
          }
        } else {
          if (cartId) {
            await axios.put(
              `${url}/api/cart/${cartId}`,
              { quantity: Number(quantity), size },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } else {
            const res = await axios.post(
              `${url}/api/cart`,
              {
                productId: Number(itemId),
                size,
                quantity: Number(quantity),
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data?.id) {
              setCartIdMap((prev) => ({
                ...prev,
                [cartKey]: res.data.id,
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error syncing cart quantity:", error);
      }
    }
  };

  const getAmount = () => {
    let total = 0;
    try {
      for (const itemId in cartItems) {
        const productData = products.find(
          (product) =>
            String(product._id || product.id) === String(itemId)
        );
        if (productData) {
          for (const item in cartItems[itemId]) {
            if (cartItems[itemId][item] > 0) {
              total += productData.price * cartItems[itemId][item];
            }
          }
        }
      }
      return total;
    } catch (error) {
      return 0;
    }
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${url}/api/products`);
      if (response.data) {
        const rawList = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        const normalizedList = rawList.map((item) => {
          const resolvedId = item._id || item.id;
          const images = Array.isArray(item.image) && item.image.length > 0
            ? item.image
            : Array.isArray(item.images) && item.images.length > 0
            ? item.images.map((img) => (typeof img === "string" ? img : img.imageUrl)).filter(Boolean)
            : [];

          const sizes = Array.isArray(item.size) && item.size.length > 0
            ? item.size
            : Array.isArray(item.sizes) && item.sizes.length > 0
            ? item.sizes.map((s) => (typeof s === "string" ? s : s.size)).filter(Boolean)
            : [];

          const isBest = Boolean(item.bestSeller || item.bestseller);

          return {
            ...item,
            _id: String(resolvedId),
            id: resolvedId,
            image: images,
            images: item.images || images,
            size: sizes,
            sizes: item.sizes || sizes,
            bestSeller: isBest,
            bestseller: isBest,
          };
        });
        setProducts(normalizedList);
      }
    } catch (error) {
      console.error("Error fetching products from backend:", error);
    }
  };

  const getCartData = async (activeToken) => {
    if (!activeToken) return;
    try {
      const response = await axios.get(`${url}/api/cart`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (response.data && Array.isArray(response.data)) {
        const serverCart = {};
        const idMap = {};
        response.data.forEach((item) => {
          const pId = String(item.productId);
          if (!serverCart[pId]) serverCart[pId] = {};
          serverCart[pId][item.size] = item.quantity;
          idMap[`${pId}_${item.size}`] = item.id;
        });

        // Merge with existing local cart items
        setCartItems((prev) => {
          const merged = { ...prev };
          for (const pid in serverCart) {
            if (!merged[pid]) merged[pid] = {};
            for (const sz in serverCart[pid]) {
              merged[pid][sz] = Math.max(
                merged[pid][sz] || 0,
                serverCart[pid][sz]
              );
            }
          }
          return merged;
        });
        setCartIdMap(idMap);
      }
    } catch (error) {
      console.error("Error fetching server cart:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
    setCartIdMap({});
    toast.info("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getCartData(savedToken);
    }
  }, []);

  const getImageUrl = (imageSrc) => {
    if (!imageSrc) return "";
    if (Array.isArray(imageSrc)) {
      imageSrc = imageSrc[0];
    }
    if (!imageSrc) return "";
    if (typeof imageSrc === "string") {
      if (
        imageSrc.startsWith("http://") ||
        imageSrc.startsWith("https://") ||
        imageSrc.startsWith("data:")
      ) {
        return imageSrc;
      }
      return `${backendUrl}/images/${imageSrc}`;
    }
    return imageSrc;
  };

  const contextValue = {
    products,
    currency,
    showPara,
    setShowPara,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addCartData,
    cartItems,
    setCartItems,
    getCart,
    updateQuantity,
    getAmount,
    url,
    url1,
    getImageUrl,
    navigate,
    token,
    setToken,
    logout,
    selectClothe,
    setSelectClothe,
    fetchProducts: getProductData,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
