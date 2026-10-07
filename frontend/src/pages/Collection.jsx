import React, { useContext, useEffect, useState } from "react";
import TextContent from "../components/TextContent";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../contextStore/ShopContext";
import ProductsItem from "../components/ProductsItem";

function Collection() {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubcategory] = useState([]);
  const [sorting, setSorting] = useState();
  const [filterProduct, setFilterProduct] = useState([]);
  let collectionName = useLocation();
  const { setShowPara, products, search, showSearch } = useContext(ShopContext);
  useEffect(() => {
    if (collectionName.pathname.includes("/collection")) {
      setShowPara(true);
    }
  }, [collectionName]);

  const CategoryToggle = (e) => {
    if (!category.includes(e.target.value)) {
      setCategory((data) => [...data, e.target.value]);
    } else {
      setCategory((data) => data.filter((item) => item !== e.target.value));
    }
  };
  const subCategoryToggle = (e) => {
    if (!subCategory.includes(e.target.value)) {
      setSubcategory((data) => [...data, e.target.value]);
    } else {
      setSubcategory((data) => data.filter((item) => item !== e.target.value));
    }
  };
  const applyFunction = () => {
    let productCopy = products.slice();
    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().split(" ").includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    if (sorting === "high-low") {
      productCopy = productCopy.sort((a, b) => b.price - a.price);
    }
    if (sorting === "low-high") {
      productCopy = productCopy.sort((a, b) => a.price - b.price);
    }
    setFilterProduct(productCopy);
  };
  useEffect(() => {
    setFilterProduct(products);
  }, []);
  useEffect(() => {
    applyFunction();
  }, [category, subCategory, sorting, search, products]);
  return (
    <>
      <div className="flex flex-row justify-around">
        <TextContent text1={"ALL"} text2={"COLLECTIONS"} />
        <select
          className="mb-2 bg-black text-white px-3 rounded-[4px]"
          onChange={(e) => setSorting(e.target.value)}
        >
          <option>default</option>
          <option>high-low</option>
          <option>low-high</option>
        </select>
      </div>

      <div className="flex flex-row ml-2 gap-2">
        <div className="ml-4">
          <h1 className="mb-3">FILTER</h1>
          <div className="flex flex-col ml-3 border-[3px] border-black p-5 mb-2 relative">
            <p className="-ml-2 -mt-2 mb-2">COTEGORIES</p>
            <div className="flex flex-row gap-2">
              <input type="checkbox" value="Men" onChange={CategoryToggle} />
              <label>Men</label>
            </div>
            <div className="flex flex-row gap-2">
              <input type="checkbox" value="Women" onChange={CategoryToggle} />
              <label>Women</label>
            </div>
            <div className="flex flex-row gap-2">
              <input type="checkbox" value="Kids" onChange={CategoryToggle} />
              <label>Kids</label>
            </div>
          </div>
          <div className="flex flex-col ml-3 border-[3px] border-black p-5">
            <p className="-ml-2 -mt-2 mb-2">TYPE</p>
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                value="Topwear"
                onChange={subCategoryToggle}
              />
              <label>Topwear</label>
            </div>
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                value="Bottomwear"
                onChange={subCategoryToggle}
              />
              <label>Bottomwear</label>
            </div>
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                value="Winterwear"
                onChange={subCategoryToggle}
              />
              <label>Winterwear</label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 mx-2">
          {filterProduct.map((item, index) => {
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
      </div>
    </>
  );
}

export default Collection;
