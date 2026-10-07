import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contextStore/ShopContext";
import ProductsItem from "./ProductsItem";

function LetestCollection() {
  const { products } = useContext(ShopContext);
  const [latestCollection, setLetestCollection] = useState([]);
  useEffect(() => {
    setLetestCollection(products.slice(0, 10));
  }, [products]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mx-[10px]">
        {latestCollection.map((item, index) => {
          return (
            <ProductsItem
              key={item._id || item.id || index}
              id={item._id || item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          );
        })}
      </div>
    </>
  );
}

export default LetestCollection;
