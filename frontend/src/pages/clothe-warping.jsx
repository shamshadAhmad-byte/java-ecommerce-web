import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { ShopContext } from "../contextStore/ShopContext";

function ClotheWarping() {
  const { url, token, selectClothe } = useContext(ShopContext);
  const [personBase64, setPersonBase64] = useState(null);
  const [clotheBase64, setClotheBase64] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reusable function to convert blob to base64
  const blobToBase64 = useCallback((blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // Convert clothing URL to base64 whenever the selected clothe changes
  useEffect(() => {
    let isMounted = true;
    
    const convertClotheToBase64 = async () => {
      if (!selectClothe) {
        setClotheBase64(null);
        return;
      }
      
      try {
        const res = await fetch(selectClothe);
        if (!res.ok) throw new Error("Failed to fetch clothing image");
        
        const blob = await res.blob();
        const base64 = await blobToBase64(blob);
        const [, data] = base64.split(",");
        
        if (isMounted) {
          setClotheBase64(data || null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Clothe conversion error:", err);
          setError("Failed to load clothing image");
        }
      }
    };

    convertClotheToBase64();
    
    return () => {
      isMounted = false;
    };
  }, [selectClothe, blobToBase64]);

  const handlePersonImageChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    try {
      const base64 = await blobToBase64(file);
      const [, data] = base64.split(",");
      
      setPersonBase64(data || null);
      setPersonPreview(base64);
      setError(null);
    } catch (err) {
      console.error("Person image conversion error:", err);
      setError("Failed to process person image");
    }
  }, [blobToBase64]);
  const handleUpload = useCallback(async () => {
    if (!personBase64) {
      setError("Please select a person image");
      return;
    }
    if (!clotheBase64) {
      setError("Please select a clothing item first");
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await axios.post(
        `${url}/web/try-on/ai-model`,
        { personBase64, clotheBase64 },
        { headers: { token } }
      );

      const { data } = response;
      
      if (data.success && data.dataUri) {
        setResultImage(data.dataUri);
      } else if (data.image && data.mimeType) {
        setResultImage(`data:${data.mimeType};base64,${data.image}`);
      } else {
        setError(data.message || data.error || "AI model returned unexpected response");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to process image";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [personBase64, clotheBase64, url, token]);

  // Memoize button disabled state
  const isButtonDisabled = useMemo(() => 
    loading || !personBase64 || !clotheBase64,
    [loading, personBase64, clotheBase64]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Virtual Try-On</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-start">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Person Image</h3>
          <div className="w-64 h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mb-2">
            {personPreview ? (
              <img
                src={personPreview}
                alt="Person preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handlePersonImageChange}
            className="mb-2 text-sm"
            accept="image/*"
          />
        </div>

        {/* Clothe Preview */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Selected Clothing</h3>
          <div className="w-64 h-80 border-2 border-gray-300 rounded-lg overflow-hidden mb-2">
            {selectClothe ? (
              <img src={selectClothe} alt="Selected clothing" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No clothing selected
              </div>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={isButtonDisabled}
            className={`px-6 py-2 rounded font-semibold transition ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : (
              "Generate Try-On"
            )}
          </button>
        </div>

        {/* Result Image */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <div className="w-64 h-80 border-2 border-gray-300 rounded-lg overflow-hidden mb-2">
            {resultImage ? (
              <img
                src={resultImage}
                alt="AI result"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {loading ? "Generating..." : "Result will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClotheWarping;