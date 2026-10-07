import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import RelatedProductDisplay from "./RelatedProductDisplay";

function RealtedProduct({ category, subCategory, currentProductId }) {
  const { products } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const applyRelated = () => {
    if (!products || products.length === 0) return;
    let relatedCopyProduct = products.filter(
      (item) =>
        item.category === category &&
        String(item._id || item.id) !== String(currentProductId)
    );
    if (relatedCopyProduct.length === 0) {
      relatedCopyProduct = products.filter(
        (item) => String(item._id || item.id) !== String(currentProductId)
      );
    }
    setRelatedProducts(relatedCopyProduct.slice(0, 5));
  };
  useEffect(() => {
    applyRelated();
  }, [products, category, subCategory, currentProductId]);
  if (relatedProducts.length === 0) return null;
  return (
    <div className="my-12">
      <div className="text-center py-6">
        <h3 className="text-2xl font-bold text-gray-800">Related Products</h3>
        <p className="text-sm text-gray-500 mt-1">
          Explore items similar to this selection
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center max-w-6xl mx-auto px-4">
        {relatedProducts.map((item, index) => {
          return (
            <RelatedProductDisplay
              key={item._id || item.id || index}
              id={item._id || item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RealtedProduct;
