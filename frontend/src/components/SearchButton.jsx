import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../contextStore/ShopContext";
import { assets } from "../../assets/assets";

function SearchButton() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { showSearch, search, setSearch, setShowSearch } =
    useContext(ShopContext);
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);
  const onchangeHandle = (e) => {
    setSearch(e.target.value);
  };

  return showSearch && visible ? (
    <div className="flex flex-row gap-3 justify-self-center ml-[32rem]">
      <div className="flex flex-row gap-3 border-[3px] border-black px-8 py-2 rounded-[30px]">
        <input
          type="text"
          placeholder="Search type"
          value={search}
          onChange={onchangeHandle}
          className="px-2 py-[5px] border-none outline-none justify-self-center self-center"
        />
        <img
          src={assets.search_icon}
          className="w-6 h-6 object-cover self-center justify-self-center"
        />
        <img
          src={assets.cross_icon}
          className="w-4 h-4 object-cover self-center justify-self-center"
          onClick={() => setShowSearch(false)}
        />
      </div>
    </div>
  ) : null;
}

export default SearchButton;
