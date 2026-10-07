import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import ProductsItem from "./ProductsItem";

function BestSeller() {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    setBestSeller(products.filter((item) => item.bestSeller || item.bestseller));
  }, [products]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mx-[10px]">
      {bestSeller.map((item, index) => {
        return (
          <ProductsItem
            key={item._id || item.id || index}
            id={item._id || item.id}
            price={item.price}
            name={item.name}
            image={item.image}
          />
        );
      })}
    </div>
  );
}

export default BestSeller;
